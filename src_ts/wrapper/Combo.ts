import * as Orders from "Orders"
import * as Utils from "Utils"

var additional_delay = 30

export enum EComboAction {
	NEARBY_ENEMY_CREEP = 1,
	NEARBY_ENEMY_SIEGE,
	NEARBY_ALLY_TOWER,
	NEARBY_ENEMY_TOWER,
	NEARBY_ENEMY,
	NEARBY_ALLY,
	CURSOR_ENEMY,
	CURSOR_ALLY,
	CURSOR_POS,
	SELF,
	NO_TARGET,
	TOGGLE,
}

interface ComboOptions {
	// must be in MS
	combo_delay?: number
	dynamicDelay?: (abil: C_DOTABaseAbility, caster: C_DOTA_BaseNPC, ent: C_DOTA_BaseNPC) => number
	castCondition?: (abil: C_DOTABaseAbility, caster: C_DOTA_BaseNPC, ent: C_DOTA_BaseNPC) => boolean
	// must be in MS
	custom_cast?: (caster: C_DOTA_BaseNPC, ent: C_DOTA_BaseNPC) => /*delay: */number
}

type AbilDef = [string | RegExp, number | ((caster: C_DOTA_BaseNPC, target: C_DOTA_BaseNPC) => number), ComboOptions]

export class Combo {
	abils: AbilDef[] = []
	vars: any = {} // available while combo are executing, clearing on end
	cursor_enemy: C_DOTA_BaseNPC = undefined
	cursor_ally: C_DOTA_BaseNPC = undefined
	cursor_pos: Vector3 = undefined

	/** @param {EComboAction} act */
	addAbility(abilName: string | RegExp, act: number | ((caster: C_DOTA_BaseNPC, target: C_DOTA_BaseNPC) => number), options: ComboOptions = {}, index?: number): void {
		var obj: AbilDef = [abilName, act, options]
		if (index !== undefined)
			this.abils.splice(index, 0, obj)
		else
			this.abils.push(obj)
	}

	addDelay(delay: number | ((caster: C_DOTA_BaseNPC, target: C_DOTA_BaseNPC) => number) = 30, options: ComboOptions = {}) { this.addAbility("delay", delay) }
	/** @param {EComboAction} act */
	addLinkenBreaker(act: number = EComboAction.CURSOR_ENEMY, options: ComboOptions = {}) { this.addAbility("linken_breaker", act) }
	/** @param {EComboAction} act */
	addMove(act: number = EComboAction.CURSOR_ENEMY, options: ComboOptions = {}) { this.addAbility("move", act) }

	removeAbility(abilName: string): void {
		var flag = true
		while (flag) {
			let abilAr = this.abils.filter(([abilName2]) => abilName === abilName2)
			if (flag = (abilAr.length > 0))
				delete abilAr[0]
		}
	}

	getNextAbility(caster: C_DOTA_BaseNPC, index: number): [C_DOTABaseAbility, string | RegExp, number | number | ((caster: C_DOTA_BaseNPC, target: C_DOTA_BaseNPC) => number), ComboOptions] {
		var [abilName, act, options] = this.abils[index]
		return [Utils.GetAbility(caster, abilName) || Utils.GetItem(caster, abilName), abilName, act, options]
	}

	tech_names = [
		"linken_breaker",
		"move",
		"custom_cast",
	]
	execute(caster: C_DOTA_BaseNPC, callback?: () => void, index: number = 0): void {
		if (index === 0) {
			// we need only instance from combo start, and as Utils.GetCursorWorldVec is dynamically changed vector - we need new instance of it
			this.cursor_pos = Utils.GetCursorWorldVec()
			
			let ents_under_cursor = Utils.GetEntitiesInRange(this.cursor_pos, 1000, false, true); // must be split from another declarations, otherwise loop optimized will fuck up our code
			
			let cursor_enemy = ents_under_cursor.filter(ent => Utils.IsEnemy(ent, caster) && (ent instanceof C_DOTA_Unit_Roshan || (ent instanceof C_DOTA_BaseNPC_Hero && ent.m_hReplicatingOtherHeroModel === undefined))),
				cursor_ally = ents_under_cursor.filter(ent => !Utils.IsEnemy(ent, caster) && ent instanceof C_DOTA_BaseNPC_Hero && ent.m_hReplicatingOtherHeroModel === undefined)
			this.cursor_ally = cursor_ally.length > 0 ? this.cursor_ally = cursor_ally[0] : undefined
			this.cursor_enemy = cursor_enemy.length > 0 ? this.cursor_enemy = cursor_enemy[0] : undefined
		}
		var [abil, abilName, act, options] = this.getNextAbility(caster, index),
			delay: number = options.combo_delay
				? options.combo_delay + additional_delay
				: abil
					? abil.m_fCastPoint * 1000 + additional_delay
					: 0

		if (options.castCondition !== undefined && !options.castCondition(abil, caster, target)) {
			this.nextExecute(caster, callback, delay, index)
			return
		}
		if (abilName === "delay") {
			if (act instanceof Function) delay = act(caster, this.cursor_enemy)
			else delay = act
			if (delay === -1) setTimeout(5, () => this.execute(caster, callback, index))
			else this.nextExecute(caster, callback, delay, index)
			return
		}
		
		if (/*!this.tech_names.some(name => abilName === name) &&*/ (abil === undefined || abil.m_iLevel === 0 || abil.m_fCooldown !== 0)) {
			this.nextExecute(caster, callback, delay, index)
			return
		}

		// target selection switch
		var cast_range = Utils.GetCastRange(caster, abil),
			target: C_DOTA_BaseNPC
		switch (act) {
			case EComboAction.NEARBY_ENEMY_CREEP:
				var creepsOnCursor = Utils.GetEntitiesInRange(caster.m_vecNetworkOrigin, cast_range, true, true).filter(ent => Utils.IsCreep(ent))
				if (creepsOnCursor.length === 0) {
					act = undefined
					break
				}
				target = creepsOnCursor[0]
				break
			case EComboAction.NEARBY_ENEMY_SIEGE:
				var creepsOnCursor = Utils.GetEntitiesInRange(caster.m_vecNetworkOrigin, cast_range, true, true).filter(ent => ent instanceof C_DOTA_BaseNPC_Creep_Siege)
				if (creepsOnCursor.length === 0) {
					act = undefined
					break
				}
				target = creepsOnCursor[0]
				break
			case EComboAction.NEARBY_ALLY_TOWER:
				var nearbyAllyTowers = Utils.GetEntitiesInRange(caster.m_vecNetworkOrigin, cast_range, false, true).filter(ent => !Utils.IsEnemy(ent, caster) && Utils.IsTower(ent))
				if (nearbyAllyTowers.length === 0) {
					act = undefined
					break
				}
				target = nearbyAllyTowers[0]
				break
			case EComboAction.NEARBY_ENEMY_TOWER:
				var nearbyEnemyTowers = Utils.GetEntitiesInRange(caster.m_vecNetworkOrigin, cast_range, true, true).filter(ent => ent instanceof C_DOTA_BaseNPC_Tower)
				if (nearbyEnemyTowers.length === 0) {
					act = undefined
					break
				}
				target = nearbyEnemyTowers[0]
				break
			case EComboAction.NEARBY_ALLY:
				var nearbyAllies = Utils.GetEntitiesInRange(caster.m_vecNetworkOrigin, cast_range, false, true).filter(ent => !Utils.IsEnemy(ent, caster) && Utils.IsHero(ent) && !ent.m_bIsIllusion)
				if (nearbyAllies.length === 0) {
					act = undefined
					break
				}
				target = nearbyAllies[0]
				break
			case EComboAction.NEARBY_ENEMY:
				var nearbyEnemies = Utils.GetEntitiesInRange(caster.m_vecNetworkOrigin, cast_range, true, true).filter(ent => ent instanceof C_DOTA_Unit_Roshan || (Utils.IsHero(ent) && !ent.m_bIsIllusion))
				if (nearbyEnemies.length === 0) {
					act = undefined
					break
				}
				target = nearbyEnemies[0]
				break
			case EComboAction.CURSOR_ALLY:
				target = this.cursor_ally
				if (target === undefined) act = undefined
				break
			case EComboAction.CURSOR_ENEMY:
				target = this.cursor_enemy
				if (target === undefined) act = undefined
				break
			case EComboAction.CURSOR_POS:
			case EComboAction.SELF:
			case EComboAction.NO_TARGET:
			case EComboAction.TOGGLE:
			case undefined:
				break
			default:
				throw "Unknown EComboAction: " + act
		}

		if (abilName === "linken_breaker") {
			if (Utils.HasLinkenAtTime(target) && [
				"item_force_staff",
				"item_hurricane_pike",
				"item_sheepstick",
				"item_heavens_halberd",
				"item_diffusal_blade",
				"item_abyssal_blade",
				"item_cyclone",
				/item_(urn_of_shadows|spirit_vessel)/,
				/item_(solar_crest|medallion_of_courage)/,
				/item_dagon/,
				/item_(bloodthorn|orchid)/,
			].some(item_name => (abil = Utils.GetItem(caster, item_name)) !== undefined)) {
				Orders.CastTarget(caster, abil, target, false)
				delay = options.combo_delay
					? options.combo_delay
					: abil
						? abil.m_fCastPoint * 1000 + 30 * 4
						: 0
			}
		} else if (abilName === "move") {
			Orders.MoveToPos(caster, target.m_vecNetworkOrigin, false)
			this.nextExecute(caster, callback, delay + (caster.m_vecNetworkOrigin.Distance2D(target.m_vecNetworkOrigin) / caster.m_fIdealSpeed) * 1000, index)
			return
		} else if (abilName === "custom_cast") {
			this.nextExecute(caster, callback, options.custom_cast(caster, target), index)
			return
		} else if (act !== undefined) {
			// cast switch
			var Behavior = abil.m_pAbilityData.m_iAbilityBehavior
			switch (act) {
				case EComboAction.NEARBY_ENEMY_CREEP:
				case EComboAction.NEARBY_ENEMY_SIEGE:
				case EComboAction.NEARBY_ALLY_TOWER:
				case EComboAction.NEARBY_ENEMY_TOWER:
				case EComboAction.NEARBY_ALLY:
				case EComboAction.NEARBY_ENEMY:
				case EComboAction.CURSOR_ALLY:
				case EComboAction.CURSOR_ENEMY:
					if (Utils.IsFlagSet(Behavior, BigInt(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)))
						Orders.CastPosition (
							caster, abil,
							options.dynamicDelay
								? Utils.VelocityWaypoint(target, options.dynamicDelay(abil, caster, target))
								: target.m_vecNetworkOrigin,
							false,
						)
					else
						Orders.CastTarget(caster, abil, target, false)
					break
				case EComboAction.CURSOR_POS:
					Orders.CastPosition(caster, abil, this.cursor_pos, false)
					break
				case EComboAction.SELF:
					if (Utils.IsFlagSet(Behavior, BigInt(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)))
						Orders.CastPosition(caster, abil, caster.m_vecNetworkOrigin, false)
					else
						Orders.CastTarget(caster, abil, caster, false)
					break
				case EComboAction.NO_TARGET:
					Orders.CastNoTarget(caster, abil, false)
					break
				case EComboAction.TOGGLE:
					Orders.ToggleAbil(caster, abil, false)
					break
				default:
					throw "Unknown EComboAction: " + act
			}
		}

		this.nextExecute(caster, callback, delay, index)
	}

	nextExecute(caster: C_DOTA_BaseNPC, callback: (() => void) | undefined, delay: number, index: number): void {
		if (++index < this.abils.length) // increments variable and checks is index valid
			setTimeout(delay > 0 ? delay + (GetAvgLatency(Flow_t.IN) + GetAvgLatency(Flow_t.OUT)) * 1000 : 0, () => this.execute(caster, callback, index))
		else {
			this.vars = {}
			if (callback instanceof Function) callback()
		}
	}

	get abilsNames(): Array<string | RegExp> { return this.abils.map(([abilName]) => abilName) }

	get length(): number { return this.abils.length }
}

{
	let root = new Menu_Node("Combo Base")
	root.entries.push(new Menu_SliderInt (
		"Additional delay",
		additional_delay,
		0,
		200,
		"In milliseconds",
		node => additional_delay = node.value,
	))
	root.Update()
	Menu.AddEntry(root)
}
