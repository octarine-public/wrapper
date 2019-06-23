import { Vector3, Ability, Unit, Utils, EntityManager, Hero, Tower, Creep } from "./Imports"

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
	dynamicDelay?: (abil: Ability, caster: Unit, ent: Unit) => number
	castCondition?: (abil: Ability, caster: Unit, ent: Unit) => boolean
	// must be in MS
	custom_cast?: (caster: Unit, ent: Unit) => /*delay: */number
}

type AbilDef = [string | RegExp, number | ((caster: Unit, target: Unit) => number), ComboOptions]

export class Combo {
	abils: AbilDef[] = []
	vars: any = {} // available while combo are executing, clearing on end
	cursor_enemy: Unit = undefined
	cursor_ally: Unit = undefined
	cursor_pos: Vector3 = undefined

	/** @param {EComboAction} act */
	addAbility(abilName: string | RegExp, act: number | ((caster: Unit, target: Unit) => number), options: ComboOptions = {}, index?: number): void {
		var obj: AbilDef = [abilName, act, options]
		if (index !== undefined)
			this.abils.splice(index, 0, obj)
		else
			this.abils.push(obj)
	}

	addDelay(delay: number | ((caster: Unit, target: Unit) => number) = 30, options: ComboOptions = {}) { this.addAbility("delay", delay) }
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

	getNextAbility(caster: Unit, index: number): [Ability, string | RegExp, number | ((caster: Unit, target: Unit) => number), ComboOptions] {
		var [abilName, act, options] = this.abils[index]
		return [caster.AbilitiesBook.GetAbilityByName(abilName) || caster.GetItemByName(abilName), abilName, act, options]
	}

	tech_names = [
		"linken_breaker",
		"move",
		"custom_cast",
	]
	execute(caster: Unit, callback?: () => void, index: number = 0): void {
		if (index === 0) {
			// we need only instance from combo start, and as Utils.GetCursorWorldVec is dynamically changed vector - we need new instance of it
			this.cursor_pos = Utils.CursorWorldVec
			
			let ents_under_cursor = EntityManager.GetEntitiesInRange(this.cursor_pos, 1000); // must be split from another declarations, otherwise loop optimizer will fuck up our code
			
			let cursor_enemy = ents_under_cursor.filter(ent => ent.IsEnemy(caster) && (ent instanceof Roshan || (ent instanceof Hero && ent.m_pBaseEntity.m_hReplicatingOtherHeroModel === undefined))) as Unit[],
				cursor_ally = ents_under_cursor.filter(ent => !ent.IsEnemy(caster) && ent instanceof Hero && ent.m_pBaseEntity.m_hReplicatingOtherHeroModel === undefined) as Unit[]
			this.cursor_ally = cursor_ally.length > 0 ? this.cursor_ally = cursor_ally[0] : undefined
			this.cursor_enemy = cursor_enemy.length > 0 ? this.cursor_enemy = cursor_enemy[0] : undefined
		}
		var [abil, abilName, act, options] = this.getNextAbility(caster, index),
			delay: number = options.combo_delay
				? options.combo_delay + additional_delay
				: abil
					? abil.CastPoint * 1000 + additional_delay
					: 0

		if (options.castCondition !== undefined && !options.castCondition(abil, caster, target)) {
			this.nextExecute(caster, callback, delay, index)
			return
		}
		if (abilName === "delay") {
			if (act instanceof Function) delay = act(caster, this.cursor_enemy)
			else delay = act
			if (delay === -1) setTimeout(() => this.execute(caster, callback, index), 5)
			else this.nextExecute(caster, callback, delay, index)
			return
		}
		
		let is_tech = this.tech_names.some(name => abilName === name)
		if (!is_tech && (abil === undefined || abil.Level === 0 || abil.Cooldown !== 0)) {
			this.nextExecute(caster, callback, delay, index)
			return
		}

		// target selection switch
		var cast_range = !is_tech ? abil.CastRange : 0,
			target: Unit
		switch (act) {
			case EComboAction.NEARBY_ENEMY_CREEP:
				var creepsOnCursor = EntityManager.GetEntitiesInRange(caster.NetworkPosition, cast_range).filter(ent => ent instanceof Creep && ent.IsEnemy(caster)) as Unit[]
				if (creepsOnCursor.length === 0) {
					act = undefined
					break
				}
				target = creepsOnCursor[0]
				break
			case EComboAction.NEARBY_ENEMY_SIEGE:
				var creepsOnCursor = EntityManager.GetEntitiesInRange(caster.NetworkPosition, cast_range).filter(ent => ent instanceof Siege && ent.IsEnemy(caster)) as Unit[]
				if (creepsOnCursor.length === 0) {
					act = undefined
					break
				}
				target = creepsOnCursor[0]
				break
			case EComboAction.NEARBY_ALLY_TOWER:
				var nearbyAllyTowers = EntityManager.GetEntitiesInRange(caster.NetworkPosition, cast_range).filter(ent => ent instanceof Tower && !ent.IsEnemy(caster)) as Unit[]
				if (nearbyAllyTowers.length === 0) {
					act = undefined
					break
				}
				target = nearbyAllyTowers[0]
				break
			case EComboAction.NEARBY_ENEMY_TOWER:
				var nearbyEnemyTowers = EntityManager.GetEntitiesInRange(caster.NetworkPosition, cast_range).filter(ent => ent instanceof Tower && ent.IsEnemy(caster)) as Unit[]
				if (nearbyEnemyTowers.length === 0) {
					act = undefined
					break
				}
				target = nearbyEnemyTowers[0]
				break
			case EComboAction.NEARBY_ALLY:
				var nearbyAllies = EntityManager.GetEntitiesInRange(caster.NetworkPosition, cast_range).filter(ent => !ent.IsEnemy(caster) && ent instanceof Hero && !ent.IsIllusion) as Unit[]
				if (nearbyAllies.length === 0) {
					act = undefined
					break
				}
				target = nearbyAllies[0]
				break
			case EComboAction.NEARBY_ENEMY:
				var nearbyEnemies = EntityManager.GetEntitiesInRange(caster.NetworkPosition, cast_range).filter(ent => ent instanceof Roshan || (ent instanceof Hero && !ent.IsIllusion)) as Unit[]
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
			if (
				target !== undefined
				&& target.HasLinkenAtTime()
				&& [
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
				].some(item_name => (abil = caster.GetItemByName(item_name)) !== undefined)
			) {
				caster.CastTarget(abil, target, false)
				delay = options.combo_delay
					? options.combo_delay
					: abil
						? abil.CastPoint * 1000 + 30 * 4
						: 0
			}
		} else if (abilName === "move") {
			caster.MoveTo(target.NetworkPosition, false)
			this.nextExecute(caster, callback, delay + (caster.Distance2D(target) / caster.IdealSpeed) * 1000, index)
			return
		} else if (abilName === "custom_cast") {
			this.nextExecute(caster, callback, options.custom_cast(caster, target), index)
			return
		} else if (act !== undefined) {
			// cast switch
			var Behavior = abil.AbilityBehavior
			switch (act) {
				case EComboAction.NEARBY_ENEMY_CREEP:
				case EComboAction.NEARBY_ENEMY_SIEGE:
				case EComboAction.NEARBY_ALLY_TOWER:
				case EComboAction.NEARBY_ENEMY_TOWER:
				case EComboAction.NEARBY_ALLY:
				case EComboAction.NEARBY_ENEMY:
				case EComboAction.CURSOR_ALLY:
				case EComboAction.CURSOR_ENEMY:
					if (Behavior.includes(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT))
						caster.CastPosition (
							abil,
							options.dynamicDelay
								? target.VelocityWaypoint(options.dynamicDelay(abil, caster, target))
								: target.NetworkPosition,
							false,
						)
					else
						caster.CastTarget(abil, target, false)
					break
				case EComboAction.CURSOR_POS:
					caster.CastPosition(abil, this.cursor_pos, false)
					break
				case EComboAction.SELF:
					if (Behavior.includes(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT))
						caster.CastPosition(abil, caster.NetworkPosition, false)
					else
						caster.CastTarget(abil, caster, false)
					break
				case EComboAction.NO_TARGET:
					caster.CastNoTarget(abil, false)
					break
				case EComboAction.TOGGLE:
					caster.CastToggle(abil, false)
					break
				default:
					throw "Unknown EComboAction: " + act
			}
		}

		setTimeout(() => this.nextExecute(caster, callback, delay, index), 1000 / 30)
	}

	nextExecute(caster: Unit, callback: (() => void) | undefined, delay: number, index: number): void {
		if (++index < this.abils.length) {// increments variable and checks is index valid
			if (delay > 0)
				setTimeout(() => this.execute(caster, callback, index), delay + (GetAvgLatency(Flow_t.IN) + GetAvgLatency(Flow_t.OUT)) * 1000)
			else
				this.execute(caster, callback, index)
		} else {
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
