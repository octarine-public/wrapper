import { Ability, Creep, ExecuteOrder, Game, Item, LocalPlayer, TickSleeper, Unit, dotaunitorder_t, Flow_t, EntityManager, Hero, item_power_treads, item_bottle, TreeTemp } from "wrapper/Imports"
import {
	AutoUseItemsArcane_val,
	AutoUseItemsBloodHP_val,
	AutoUseItemsBloodMP_val,
	AutoUseItemsCheese_val,
	AutoUseItemsFaerieFire_val,
	AutoUseItemsMG_val,
	AutoUseItemsMidas_CheckBIG,
	AutoUseItemsMidas_range,
	AutoUseItemsMjollnir_val,
	AutoUseItemsPhase_val,
	AutoUseItemsPhaseBootsState,
	AutoUseItemsSouringHP_val,
	AutoUseItemsSouringInvis,
	AutoUseItemsSouringMP_val,
	AutoUseItemsSouringMPUse_val,
	AutoUseItemsSticks_val,
	AutoUseItemsUrnAlies,
	AutoUseItemsUrnAliesAlliesHP,
	AutoUseItemsUrnAliesEnemyHP,
	AutoUseItemsTango_val,
	AutoUseItemsUrnEnemy,
	ItemsForUse, State,
	// settings items neutrals
	AutoUseItemsTalon_val,
	AutoUseItemsArcanering_val,
	AutoUseItemsEssenceRing_val,
	AutoUseItemsBigFaerieFire_val,
	AutoUseItemsTalonCreepHP,
	AutoUseItemsMedal_val,
	AutoUseItemsBottleState
} from "./Menu"

import ItemManagerBase from "../../abstract/Base"
import { StateBase } from "../../abstract/MenuBase"
import { Key as HeroBlockKey } from "../../../UnitBlocker/modules/HeroBlock/Menu"
import { Key as CreepBlockKey } from "../../../UnitBlocker/modules/CreepBlock/Menu"
import { ParticleGlimer, GlimerClear, glimer } from "../../abstract/Listeners"

const Base = new ItemManagerBase()
const SleepCape = new TickSleeper()
const TickSleep = new TickSleeper()

const BuffsTango = [
	"modifier_tango_heal",
	"modifier_item_urn_heal",
	"modifier_item_spirit_vessel_heal"
]

const SmokeDetected = [
	"modifier_smoke_of_deceit",
	"modifier_phantom_assassin_blur_active"
]

const BuffsNotHeal = [
	"modifier_fountain_aura_buff",
	"modifier_item_armlet_unholy_strength",
]

const IsValidBuffsUrn = [
	"modifier_item_urn_heal",
	"modifier_item_spirit_vessel_heal"
]

const BuffsInvisDebuff = [
	"modifier_bounty_hunter_track",
	"modifier_bloodseeker_thirst_vision",
	"modifier_slardar_amplify_damage",
	"modifier_item_dustofappearance",
	"modifier_truesight",
]

const filterUnits = (x: Unit) => x.IsAlive && x.IsControllable
	&& (
		x.Name === "npc_dota_hero_riki"
		|| (x.InvisibleLevel <= 1 && !x.HasBuffByName("modifier_templar_assassin_meld") /** hack for power treads */)
		|| x.ModifiersBook.HasAnyBuffByNames(SmokeDetected)
	) // TODO blur
	&& (!x.IsIllusion || x.ModifiersBook.HasBuffByName("modifier_arc_warden_tempest_double")) &&
	!x.IsStunned && !x.IsChanneling && !x.IsInvulnerable

const IsValidItem = (item: Nullable<Item>): item is Item => item !== undefined
	&& ItemsForUse.IsEnabled(item.Name) && item.CanBeCasted()

const IsValidCreep = (creep: Creep) => creep.IsValid && creep.IsAlive
	&& creep.IsVisible && !creep.IsMagicImmune && !creep.IsAncient

const CheckUnitForUrn = (unit: Unit, MaxHP: number) => !unit.IsIllusion
	&& unit.IsAlive && unit.HP <= MaxHP && !unit.IsInvulnerable
	&& !unit.ModifiersBook.HasAnyBuffByNames([...BuffsNotHeal, ...IsValidBuffsUrn])

let nextTick = 0,
	changed = true,
	lastStat: Attributes | undefined

function AutoUseItems(unit: Unit) {
	// loop-optimizer: FORWARD
	unit.Items.some(item => {
		if (!IsValidItem(item))
			return false

		switch (item.Name) {
			case "item_royal_jelly": {
				if (LocalPlayer!.Hero !== unit || unit.HasBuffByName("modifier_royal_jelly"))
					return false
				unit.CastTarget(item, unit)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}

			case "item_faerie_fire": {
				if (unit.Buffs.some(buff => BuffsNotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HP > AutoUseItemsFaerieFire_val.value)
					return false
				unit.CastNoTarget(item)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}

			case "item_phase_boots": {
				if (HeroBlockKey.is_pressed || CreepBlockKey.is_pressed || !unit.IsMoving)
					return false
				if (unit.HasBuffByName("modifier_monkey_king_transform"))
					return false
				let enemy_phase_in_position = AutoUseItemsPhaseBootsState.value
					? EntityManager.GetEntitiesByClass(Hero).some(hero => hero.IsEnemy() && hero.IsVisible && hero.IsAlive
						&& unit.Distance2D(hero.Position) <= AutoUseItemsPhase_val.value)
					: AutoUseItemsPhaseBootsState.value
				if (AutoUseItemsPhaseBootsState.value && !enemy_phase_in_position)
					return false
				unit.CastNoTarget(item)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}

			case "item_arcane_boots": {
				if (unit.ModifiersBook.HasBuffByName(BuffsNotHeal[0]))
					return false
				if (unit.ManaPercent > AutoUseItemsArcane_val.value)
					return false
				unit.CastNoTarget(item)
				TickSleep.Sleep(Base.GetDelayCast)
				return true

			}

			case "item_tango":
			case "item_tango_single": {
				if (unit.ModifiersBook.GetAnyBuffByNames(BuffsTango))
					return false
				let tr = EntityManager.GetEntitiesByClass(TreeTemp).find(x => x.IsInRange(unit, item.CastRange))
				if (tr === undefined || unit.HPPercent > AutoUseItemsTango_val.value)
					return false
				unit.CastTargetTree(item, tr)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}

			case "item_power_treads": {
				if (lastStat === undefined || Game.RawGameTime <= nextTick)
					return false

				let Treads = item as item_power_treads
				if (Treads.ActiveAttribute !== lastStat && !changed) {
					unit.CastNoTarget(item)
					nextTick = nextTick + 0.15 + GetAvgLatency(Flow_t.OUT)
					TickSleep.Sleep(nextTick)
				}
				if (Treads.ActiveAttribute === lastStat) {
					lastStat = undefined
					changed = true
				}
				return true
			}

			case "item_bottle": {
				if (item.CurrentCharges !== 3)
					return false
				let bottleRune = item as item_bottle
				if (bottleRune.StoredRune === DOTA_RUNES.DOTA_RUNE_BOUNTY) {
					if (!AutoUseItemsBottleState.value)
						return false
					unit.CastTarget(item, unit)
					TickSleep.Sleep(Base.GetDelayCast)
					return true
				}
				if (!unit.HasBuffByName('modifier_fountain_aura_buff'))
					return false
				return EntityManager.GetEntitiesByClass(Hero).some(hero => {
					if (hero.IsEnemy() || !unit.IsInRange(hero.Position, item.CastRange))
						return false
					if (!hero.IsInvulnerable
						&& hero.IsAlive
						&& !unit.HasBuffByName("modifier_bottle_regeneration")
						&& (hero.HPPercent !== 100 || hero.ManaPercent !== 100)
					) {
						unit.CastTarget(item, hero)
						TickSleep.Sleep(Base.GetDelayCast)
						return true
					}
					return false
				})
			}

			case "item_dust": {
				if (unit.GetItemByName("item_gem") !== undefined || unit.GetItemByName("item_third_eye") !== undefined)
					return false
				// loop-optimizer: KEEP
				ParticleGlimer.forEach(val => {
					if (val.IsZero() || unit.Distance2D(val) > item.CastRange)
						return
					glimer.set(val, unit)
					SleepCape.Sleep(1500)
				})

				if (
					!EntityManager.GetEntitiesByClass(Hero).some(hero =>
						hero.IsEnemy()
						&& hero.IsAlive
						&& unit.IsInRange(hero.Position, item.CastRange)
						&& !hero.ModifiersBook.HasAnyBuffByNames(BuffsInvisDebuff)
						&& (
							hero.InvisibleLevel > 0
							|| glimer.size !== 0
							|| unit.ModifiersBook.HasBuffByName("modifier_invoker_ghost_walk_enemy")
							// TODO riki last time Position
						)
						&& !EntityManager.GetEntitiesByClass(Hero).some(ent =>
							!ent.IsEnemy()
							&& ent.IsAlive
							&& (ent.GetItemByName("item_gem") !== undefined || ent.GetItemByName("item_third_eye") !== undefined)
							&& ent.Distance2D(hero.Position) < 800
						)
					)
				)
					return false
				unit.CastNoTarget(item)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}

			case "item_hand_of_midas": {
				if (!AutoUseItemsMidas_CheckBIG.value) {
					GetAllCreepsForMidas(unit, item)
					return true
				}
				let Creep = GetAllCreepsForMidas(unit, item)
				if (Creep.length <= 0)
					return false
				Creep = Creep.sort((a, b) => b.MaxHP - a.MaxHP) // less MaxHP => first
				if (!unit.IsInRange(Creep[0].Position, ((item.CastRange + unit.CastRangeBonus) + 100)) || !unit.CanAttack(Creep[0]))
					return false
				unit.CastTarget(item, Creep[0])
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}

			case "item_mjollnir": {
				let enemy_mjolnir = EntityManager.GetEntitiesByClass(Hero).some(hero => hero.IsEnemy() && hero.IsAlive && hero.IsVisible
					&& unit.Distance2D(hero.Position) <= AutoUseItemsMjollnir_val.value)
				if (!enemy_mjolnir)
					return false
				unit.CastTarget(item, unit)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}

			case "item_magic_wand":
			case "item_magic_stick": {
				if (unit.Buffs.some(buff => BuffsNotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HPPercent < AutoUseItemsSticks_val.value) {
					unit.CastNoTarget(item)
					TickSleep.Sleep(Base.GetDelayCast)
					return true
				}
				if (unit.HPPercent < AutoUseItemsSticks_val.value) {
					unit.CastNoTarget(item)
					TickSleep.Sleep(Base.GetDelayCast)
					return true
				}
				return false
			}

			case "item_bloodstone": {
				if (unit.HPPercent > AutoUseItemsBloodHP_val.value || unit.ManaPercent < AutoUseItemsBloodMP_val.value)
					return false
				unit.CastNoTarget(item)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}

			case "item_greater_faerie_fire": {
				if (unit.Buffs.some(buff => BuffsNotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HP > AutoUseItemsBigFaerieFire_val.value)
					return false
				unit.CastNoTarget(item)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}

			case "item_cheese": {
				if (unit.Buffs.some(buff => BuffsNotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HPPercent > AutoUseItemsCheese_val.value)
					return false
				unit.CastNoTarget(item)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}

			case "item_essence_ring": {
				if (unit.Buffs.some(buff => BuffsNotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HPPercent > AutoUseItemsEssenceRing_val.value)
					return false
				unit.CastNoTarget(item)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}

			case "item_arcane_ring": {
				if (unit.ModifiersBook.HasBuffByName(BuffsNotHeal[0]))
					return false
				if (unit.Mana > AutoUseItemsArcanering_val.value)
					return false
				unit.CastNoTarget(item)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}

			case "item_mekansm":
			case "item_guardian_greaves": {
				if (unit.HasBuffByName("modifier_item_mekansm_noheal"))
					return false
				return EntityManager.GetEntitiesByClass(Hero).some(hero => {
					if (hero.IsEnemy() || !unit.IsInRange(hero.Position, item.AOERadius))
						return false
					if ((hero.IsAlive && hero.HPPercent > AutoUseItemsMG_val.value) || (unit.IsAlive && unit.HPPercent > AutoUseItemsMG_val.value))
						return false
					unit.CastNoTarget(item)
					TickSleep.Sleep(Base.GetDelayCast)
					return true
				})
			}

			case "item_urn_of_shadows":
			case "item_spirit_vessel": {
				if (CheckUnitForUrn(unit, AutoUseItemsUrnAliesAlliesHP.value)) {
					unit.CastTarget(item, unit)
					return true
				}

				if (AutoUseItemsUrnAlies.value) {
					return UrnUseAnyUnits(unit, item)
				}

				if (AutoUseItemsUrnEnemy.value) {
					return UrnUseAnyUnits(unit, item, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
				}

				return false
			}

			default:
				return false
		}
	})
}

function UrnUseAnyUnits(
	unit: Unit,
	item: Item,
	IsEnemy: DOTA_UNIT_TARGET_TEAM = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
): boolean {
	return EntityManager.GetEntitiesByClass(Hero, IsEnemy).some(hero => {
		if (!unit.IsInRange(hero.Position, item.CastRange) || !CheckUnitForUrn(hero, AutoUseItemsUrnAliesEnemyHP.value))
			return false
		unit.CastTarget(item, hero)
		TickSleep.Sleep(Base.GetDelayCast)
		return true
	})
}

function CheckCreeps(creep: Creep, unit: Unit, Item: Item): boolean {
	if (!IsValidCreep(creep) || !unit.IsInRange(creep.Position, (Item.CastRange + unit.CastRangeBonus) + 100))
		return false
	if (AutoUseItemsMidas_CheckBIG.value)
		return AutoUseItemsMidas_range.value ? !creep.IsMelee : true
	if (!AutoUseItemsMidas_range.value || creep.IsMelee)
		return false
	unit.CastTarget(Item, creep)
	TickSleep.Sleep(Base.GetDelayCast)
	return true
}

function GetAllCreepsForMidas(Unit: Unit, Item: Item) {
	return EntityManager.GetEntitiesByClass(Creep).filter(creep =>
		creep.IsEnemy() && CheckCreeps(creep, Unit, Item))
}

function UseSoulRing(Me: Unit, ability: Ability, args: ExecuteOrder): boolean {
	let soul_ring = Me.GetItemByName("item_soul_ring")
	if (!IsValidItem(soul_ring))
		return true
	if (Me.HPPercent < AutoUseItemsSouringHP_val.value || Me.ManaPercent > AutoUseItemsSouringMP_val.value
		|| (Me.IsInvisible && !Me.CanUseAbilitiesInInvisibility && !AutoUseItemsSouringInvis.value)
	) {
		return true
	}
	if (ability.ManaCost <= AutoUseItemsSouringMPUse_val.value) {
		return true
	}
	if (
		!ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)
		&& ability.CastRange !== 0
		&& (ability.CastRange * 1.5) < Me.Distance(args.Target instanceof Unit ? args.Target.Position : args.Position)
	)
		return true
	Me.CastNoTarget(soul_ring)
	return false
}

function UsePerfectDagger(args: ExecuteOrder, ability: Ability, unit: Unit): boolean {
	if (ability.Name !== "item_blink")
		return true
	let blink = unit.GetItemByName("item_blink")
	if (!IsValidItem(blink))
		return true
	let blink_range = blink.CastRange
	if (args.Position.IsInRange(unit.Position, blink_range))
		return true
	let vec = unit.Position
	if (unit.IsMoving) {
		vec = unit.Position
			.Add(unit.Forward.MultiplyScalar(unit.IdealSpeed * Game.GetLatency()))
			.Extend(args.Position, blink_range - 30)
	} else
		vec = unit.Position.Extend(args.Position, blink_range - 1)
	unit.CastPosition(blink, vec)
	return false
}

function UsePowerTreads(ability: Ability, unit: Unit): boolean {
	if (ability.ManaCost === 0 || unit.IsInvisible || TickSleep.Sleeping)
		return true
	if (
		ability.Name === "item_manta"
		|| ability.Name === "item_invis_sword"
		|| ability.Name === "item_silver_edge"
		|| ability.Name === "ember_spirit_sleight_of_fist"
		|| ability.Name === "morphling_adaptive_strike_agi"
	)
		return true

	let power_treads = unit.GetItemByName("item_power_treads") as item_power_treads
	if (power_treads === undefined || !ItemsForUse.IsEnabled(power_treads.Name))
		return true

	if (unit.IsStunned || unit.IsHexed || unit.IsInvulnerable)
		return true
	if (changed)
		lastStat = power_treads.ActiveAttribute

	switch (power_treads.ActiveAttribute) {
		case 0: // str
			unit.CastNoTarget(power_treads)
			break
		case 2: // agi
			unit.CastNoTarget(power_treads)
			unit.CastNoTarget(power_treads)
			break
		case 3: // int
			return true
	}
	changed = false
	nextTick = ((Game.RawGameTime + ability.CastPoint) + (0.45 + GetAvgLatency(Flow_t.OUT)))
	TickSleep.Sleep(nextTick)
	return false
}

export function UseMouseItemTarget(args: ExecuteOrder) {
	if (!StateBase.value || !State.value || TickSleep.Sleeping)
		return true

	let unit = args.Unit,
		target = args.Target
	if (unit === undefined || !(target instanceof Unit))
		return true

	if (target.IsBuilding)
		return true

	switch (args.OrderType) {
		case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
			if (!target.IsEnemy())
				return true
			let _Item = unit.GetItemByName("item_solar_crest") ?? unit.GetItemByName("item_medallion_of_courage")
			// console.log(unit.Buffs.map(e => e.Name))
			if (IsValidItem(_Item) && unit.IsInRange(target, _Item.CastRange) && !target.IsMagicImmune) {
				if (
					(AutoUseItemsMedal_val.selected_id === 1 && target.IsEnemy())
					|| (AutoUseItemsMedal_val.selected_id === 2 && !target.IsEnemy())
				)
					return true
				unit.CastTarget(_Item, target)
				TickSleep.Sleep(Base.GetDelayCast)
			}

			let janggo = unit.GetItemByName("item_ancient_janggo")
			if (
				IsValidItem(janggo)
				&& target.IsHero
				&& unit.IsInRange(target, janggo.CastRange / 2)
				&& !unit.HasBuffByName("modifier_item_ancient_janggo_active")
			) {
				unit.CastNoTarget(janggo)
				TickSleep.Sleep(Base.GetDelayCast)
			}

			let talon = unit.GetItemByName("item_iron_talon")
			if (
				IsValidItem(talon)
				&& unit.IsInRange(target, talon.CastRange)
				&& target.IsCreep
				&& (target.IsNeutral || (target.IsLaneCreep && AutoUseItemsTalon_val.selected_id === 1))
				&& !target.IsAncient
				&& target.HPPercent <= AutoUseItemsTalonCreepHP.value
			) {
				unit.CastTarget(talon, target)
				TickSleep.Sleep(Base.GetDelayCast)
			}

			let diffusal = unit.GetItemByName("item_diffusal_blade")
			if (
				IsValidItem(diffusal)
				&& unit.IsInRange(target, diffusal.CastRange)
				&& target.IsHero
				&& !target.IsMagicImmune
				&& !target.HasBuffByName("modifier_item_diffusal_blade_slow")
			) {
				let hex_debuff = target.GetBuffByName("modifier_sheepstick_debuff")
				if ((hex_debuff === undefined || !hex_debuff.IsValid
					|| hex_debuff.RemainingTime <= 0.3)) {
					unit.CastTarget(diffusal, target)
					TickSleep.Sleep(Base.GetDelayCast)
				}
			}
			break
	}
}

export function OnExecuteOrder(args: ExecuteOrder): boolean {
	if (!StateBase.value || !State.value) {
		return true
	}
	let unit = args.Unit as Unit
	if (unit === undefined)
		return true
	let ability = args.Ability as Ability
	if (args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION
		&& args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET
		&& args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE
		&& args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET
		&& args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE) {
		return true
	}
	if (!UsePerfectDagger(args, ability, unit)) {
		return false
	}
	if (!UseSoulRing(unit, ability, args) || !UsePowerTreads(ability, unit)) {
		args.ExecuteQueued()
		return false
	}
	return true
}

export function Tick() {
	if (!StateBase.value || TickSleep.Sleeping || !State.value)
		return
	if (SleepCape.Sleeping && (ParticleGlimer.size !== 0 || glimer.size !== 0))
		GlimerClear()
	EntityManager.GetEntitiesByClass(Unit).some(x => !x.IsEnemy() && filterUnits(x) && AutoUseItems(x))
}

export function GameEnded() {
	changed = true
	nextTick = 0
	lastStat = undefined
	TickSleep.ResetTimer()
}
