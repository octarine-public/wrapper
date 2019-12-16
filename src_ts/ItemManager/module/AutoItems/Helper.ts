import { Ability, Creep, ExecuteOrder, Game, Item, LocalPlayer, TickSleeper, Unit, dotaunitorder_t, Flow_t, EntityManager, Hero, Courier } from "wrapper/Imports"
import TempTree from "../../../wrapper/Objects/Base/TreeTemp"

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
	AutoUseItemsMedal_val
} from "./Menu"

import InitItems from "../../abstract/Items"
import ItemManagerBase from "../../abstract/Base"
import { StateBase } from "../../abstract/MenuBase"
import { Key as HeroBlockKey } from "../../../UnitBlocker/modules/HeroBlock/Menu"
import { Key as CreepBlockKey } from "../../../UnitBlocker/modules/CreepBlock/Menu"
import { ParticleGlimer, initItemsMap, GlimerClear, glimer } from "../../abstract/Listeners"

let nextTick = 0,
	changed = true,
	lastStat: Attributes,
	Base = new ItemManagerBase,
	TickSleep = new TickSleeper,
	Buffs = {
		NotHeal: [
			"modifier_fountain_aura_buff",
			"modifier_item_armlet_unholy_strength",
		],
		InvisDebuff: [
			"modifier_bounty_hunter_track",
			"modifier_bloodseeker_thirst_vision",
			"modifier_slardar_amplify_damage",
			"modifier_item_dustofappearance",
			"modifier_truesight",
		]
	}

let IsValidPlayer = () => LocalPlayer !== undefined && LocalPlayer.Hero !== undefined

// let IsLinkensProtected = (unit: Unit, Items: InitItems) => unit.HasBuffByName("modifier_item_sphere")
// 	&& Items?.Sphere?.Cooldown === 0

let filterUnits = (x: Unit) => x.IsAlive && x.IsControllable
	&& (!x.IsIllusion || x.ModifiersBook.HasBuffByName("modifier_arc_warden_tempest_double"))

let IsValidItem = (Items: Item) => Items !== undefined && Items.IsReady
	&& ItemsForUse.IsEnabled(Items.Name) && Items.CanBeCasted()

let IsValidCreep = (creep: Creep) => creep.IsValid && creep.IsAlive && creep.IsVisible && !creep.IsMagicImmune && !creep.IsAncient

let IsValidUnit = (unit: Unit) => unit.IsAlive && !unit.IsStunned && !unit.IsChanneling && !unit.IsInvulnerable
	&& (unit.Name === "npc_dota_hero_riki" || unit.InvisibleLevel <= 0 || unit.Buffs.some(buff => buff.Name === "modifier_smoke_of_deceit"))

function AutoUseItems(unit: Unit) {
	if (!filterUnits(unit) || !IsValidUnit(unit))
		return false
	let Items = initItemsMap.get(unit)
	if (Items === undefined)
		return false

	if (IsValidItem(Items.Jelly)) {
		if (IsValidPlayer() && LocalPlayer.Hero === unit) {
			if (!unit.HasBuffByName("modifier_royal_jelly")) {
				unit.CastTarget(Items.Jelly, unit)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}
		}
	}

	if (IsValidItem(Items.PhaseBoots)) {
		if (HeroBlockKey.is_pressed || CreepBlockKey.is_pressed)
			return false

		if (unit.IsMoving || unit.IdealSpeed >= Base.MaxMoveSpeed) {
			if (unit.HasBuffByName("modifier_monkey_king_transform"))
				return false

			let enemy_phase_in_position = AutoUseItemsPhaseBootsState.value
				? EntityManager.GetEntitiesByClass(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY).some(enemy => enemy.IsVisible && enemy.IsAlive
					&& unit.Distance2D(enemy.Position) <= AutoUseItemsPhase_val.value)
				: AutoUseItemsPhaseBootsState.value

			if (!AutoUseItemsPhaseBootsState.value || enemy_phase_in_position) {
				unit.CastNoTarget(Items.PhaseBoots)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}
		}
	}

	if (IsValidItem(Items.Mjollnir)) {
		let enemy_mjolnir = EntityManager.GetEntitiesByClass(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY).some(enemy => enemy.IsAlive && enemy.IsVisible
			&& unit.Distance2D(enemy.Position) <= AutoUseItemsMjollnir_val.value)
		if (enemy_mjolnir) {
			unit.CastTarget(Items.Mjollnir, unit)
			TickSleep.Sleep(Base.GetDelayCast)
			return true
		}
	}

	if ((IsValidItem(Items.MagicWand) || IsValidItem(Items.MagicStick))) {
		let item = Items.MagicWand !== undefined
			? Items.MagicWand
			: Items.MagicStick
		if (!unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
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
		}
	}

	if (IsValidItem(Items.FaerieFire)) {
		if (!unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
			if (unit.HP <= AutoUseItemsFaerieFire_val.value) {
				unit.CastNoTarget(Items.FaerieFire)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}
		}
	}

	if (IsValidItem(Items.GreaterFaerieFire)) {
		if (!unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
			if (unit.HP <= AutoUseItemsBigFaerieFire_val.value) {
				unit.CastNoTarget(Items.GreaterFaerieFire)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}
		}
	}

	if (IsValidItem(Items.Cheese)) {
		if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
			if (unit.HPPercent < AutoUseItemsCheese_val.value) {
				unit.CastNoTarget(Items.Cheese)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}
		}
	}

	if (IsValidItem(Items.EssenceRing)) {
		if (!unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
			if (unit.HPPercent <= AutoUseItemsEssenceRing_val.value) {
				unit.CastNoTarget(Items.EssenceRing)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}
		}
	}

	if (IsValidItem(Items.ArcaneRing)) {
		if (!unit.ModifiersBook.HasBuffByName(Buffs.NotHeal[0])) {
			if (unit.Mana < AutoUseItemsArcanering_val.value) {
				unit.CastNoTarget(Items.ArcaneRing)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}
		}
	}

	if (IsValidItem(Items.ArcaneBoots)) {
		if (!unit.ModifiersBook.HasBuffByName(Buffs.NotHeal[0])) {
			if (unit.ManaPercent < AutoUseItemsArcane_val.value) {
				unit.CastNoTarget(Items.ArcaneBoots)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}
		}
	}

	if (IsValidItem(Items.Mekansm) || IsValidItem(Items.GuardianGreaves)) {
		let Item = !Items.Mekansm ? Items.GuardianGreaves : Items.Mekansm
		EntityManager.GetEntitiesByClass(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY).some(allies => {
			if (unit.IsInRange(allies.Position, Item.AOERadius)) {
				if (!unit.Buffs.some(buff => buff.Name === "modifier_item_mekansm_noheal")
					&& (allies.HPPercent <= AutoUseItemsMG_val.value
						&& allies.IsAlive || unit.HPPercent <= AutoUseItemsMG_val.value
						&& unit.IsAlive)
				) {
					Item.UseAbility(unit)
					unit.CastNoTarget(Item)
					TickSleep.Sleep(Base.GetDelayCast)
					return true
				}
			}
		})
	}

	if (IsValidItem(Items.Bottle)) {
		if (Items.Bottle.CurrentCharges === 3) {
			if (unit.Buffs.some(buff => buff.Name === "modifier_fountain_aura_buff")) {
				EntityManager.GetEntitiesByClass<Hero>(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY).some(allies => {
					if (unit.IsInRange(allies.Position, Items.Bottle.CastRange)) {
						if (!allies.IsInvulnerable && !unit.Buffs.some(buff => buff.Name === "modifier_bottle_regeneration")
							&& (allies.Mana !== allies.MaxMana || allies.HP !== allies.MaxHP)) {
							unit.CastTarget(Items.Bottle, allies)
							TickSleep.Sleep(Base.GetDelayCast)
							return true
						}
					}
				})
			}
		}
	}

	if (IsValidItem(Items.Bloodstone)) {
		if (unit.HPPercent < AutoUseItemsBloodHP_val.value
			&& unit.ManaPercent > AutoUseItemsBloodMP_val.value) {
			unit.CastNoTarget(Items.Bloodstone)
			TickSleep.Sleep(Base.GetDelayCast)
			return true
		}
	}

	if (IsValidItem(Items.Midas)) {
		if (AutoUseItemsMidas_CheckBIG.value) {
			let Creep = GetAllCreepsForMidas(unit, Items.Midas)
			if (Creep.length !== 0) {
				Creep = Creep.sort((a, b) => b.MaxHP - a.MaxHP) // less MaxHP => first
				if (unit.Distance2D(Creep[0].Position) <= ((Items.Midas.CastRange + unit.CastRangeBonus) + 100) && unit.CanAttack(Creep[0])) {
					unit.CastTarget(Items.Midas, Creep[0])
					TickSleep.Sleep(Base.GetDelayCast)
					return true
				}
			}
		} else {
			GetAllCreepsForMidas(unit, Items.Midas)
		}
	}

	if (IsValidItem(Items.UrnOfShadows) || IsValidItem(Items.SpiritVesel)) {
		let Item = Items.UrnOfShadows !== undefined
			? Items.UrnOfShadows
			: Items.SpiritVesel

		if (IsValidPlayer() && CheckUnitForUrn(LocalPlayer.Hero, AutoUseItemsUrnAliesAlliesHP.value)
			&& unit.Index === LocalPlayer.Hero.Index
			&& !unit.IsIllusion
			&& LocalPlayer.Hero !== unit
			&& !LocalPlayer.Hero.Buffs.some(x =>
				x.Name === "modifier_item_urn_heal"
				|| x.Name === "modifier_item_spirit_vessel_heal")
		) {
			LocalPlayer.Hero.CastTarget(Item, LocalPlayer.Hero)
			return true
		}
		if (AutoUseItemsUrnAlies.value) {
			UnitCheckForAlliesEnemy(unit, Item, false)
			return true
		}
		if (AutoUseItemsUrnEnemy.value) {
			UnitCheckForAlliesEnemy(unit, Item)
			return true
		}
	}

	if (IsValidItem(Items.Dust)) {
		if (Items.Gem === undefined || Items.ThirdEye === undefined) {
			// loop-optimizer: KEEP
			ParticleGlimer.forEach(val => {
				if (val.IsZero() || unit.Distance2D(val) > Items.Dust.CastRange)
					return
				glimer.set(val, Items)
			})
			let IsVisible = EntityManager.GetEntitiesByClass(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY).some(enemy => enemy.IsAlive
				&& unit.IsInRange(enemy.Position, Items.Dust.CastRange)
				&& !enemy.ModifiersBook.HasAnyBuffByNames(Buffs.InvisDebuff)
				&& (enemy.InvisibleLevel > 0
					|| glimer.size !== 0
					|| unit.ModifiersBook.HasBuffByName("modifier_invoker_ghost_walk_enemy")
				)
				&& !EntityManager.GetEntitiesByClasses<Unit>([Hero, Courier], DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY).some(allies => allies.IsAlive
					&& (allies.GetItemByName("item_gem") || allies.GetItemByName("item_third_eye"))
					&& allies.Distance2D(enemy.Position) < 800))

			if (IsVisible) {
				unit.CastNoTarget(Items.Dust)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}
		}
	}

	if (!unit.ModifiersBook.GetAnyBuffByNames(
		[
			"modifier_tango_heal",
			"modifier_item_urn_heal",
			"modifier_item_spirit_vessel_heal"
		]
	) && (IsValidItem(Items.Tango) || IsValidItem(Items.TangoSingle))) {
		let Tango = !Items.Tango ? Items.TangoSingle : Items.Tango,
			tr = EntityManager.GetEntitiesByClass(TempTree, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH)
				.find(x => x.IsInRange(unit, Tango.CastRange))
		if (tr !== undefined && unit.HP <= AutoUseItemsTango_val.value) {
			unit.CastTargetTree(Tango, tr)
			TickSleep.Sleep(Base.GetDelayCast)
			return true
		}
	}
	// if (IsValidItem(Items.Abyssal)) {
	// 	Units.some(x => {
	// 		if (x === undefined || !x.IsHero || !x.IsValid || !x.IsAlive || x.IsInvulnerable || !x.IsEnemy(unit) || x.IsDormant)
	// 			return false
	// 		let enemy_items = initItemsMap.get(x)
	// 		if (enemy_items === undefined || !x.IsInRange(unit, Items.Abyssal.CastRange) || IsLinkensProtected(x, enemy_items))
	// 			return false
	// 		unit.CastTarget(Items.Abyssal, x)
	// 		TickSleep.Sleep(Base.GetDelayCast)
	// 		return true
	// 	})
	// }
	// Power treads
	if (lastStat !== undefined && Game.RawGameTime >= nextTick) {
		if (Items.PowerTreads !== undefined
			&& ItemsForUse.IsEnabled(Items.PowerTreads.Name)) {
			if (Items.ActiveAttribute !== lastStat && !changed) {
				unit.CastNoTarget(Items.PowerTreads)
				nextTick = nextTick + 0.15 + GetAvgLatency(Flow_t.OUT)
				TickSleep.Sleep(Base.GetDelayCast)
			}
			if (Items.ActiveAttribute === lastStat) {
				lastStat = undefined
				changed = true
			}
			return true
		}
	}
}

function CheckUnitForUrn(Unit: Unit, MaxHP: number) {
	return Unit.IsAlive && Unit.HP <= MaxHP && !Unit.IsInvulnerable
		&& !Unit.ModifiersBook.GetAnyBuffByNames(Buffs.NotHeal)
}

function CheckCreeps(creep: Creep, unit: Unit, Item: Item): boolean {
	if (IsValidCreep(creep) && unit.Distance2D(creep.Position) <= (Item.CastRange + unit.CastRangeBonus) + 100) {
		if (!AutoUseItemsMidas_CheckBIG.value) {
			if (AutoUseItemsMidas_range.value) {
				if (!creep.IsMelee) {
					unit.CastTarget(Item, creep)
					TickSleep.Sleep(Base.GetDelayCast)
					return true
				}
			} else {
				unit.CastTarget(Item, creep)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}
		}
		return AutoUseItemsMidas_range.value ? !creep.IsMelee : true
	}
}

function GetAllCreepsForMidas(Unit: Unit, Item: Item) {
	return EntityManager.GetEntitiesByClass(Creep, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
		.filter(creep => CheckCreeps(creep, Unit, Item))
}

function UnitCheckForAlliesEnemy(unit: Unit, Item: Item, IsEnemy: boolean = true) {
	EntityManager.GetEntitiesByClass(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH).map(enemy => {
		let target = IsEnemy ? enemy : unit
		if (unit.IsInRange(target.Position, Item.CastRange)) {
			if (CheckUnitForUrn(target, IsEnemy ? AutoUseItemsUrnAliesEnemyHP.value : AutoUseItemsUrnAliesAlliesHP.value) && !enemy.IsIllusion
				&& !target.ModifiersBook.GetAnyBuffByNames(["modifier_item_urn_heal", "modifier_item_spirit_vessel_heal"])
			) {
				unit.CastTarget(Item, target)
				TickSleep.Sleep(Base.GetDelayCast)
				return true
			}
		}
	})
}

function UseSoulRing(Me: Unit, Items: InitItems, ability: Ability, args: ExecuteOrder): boolean {
	if (!IsValidItem(Items.SoulRing)) {
		return true
	}
	if (Me.HPPercent < AutoUseItemsSouringHP_val.value || Me.ManaPercent > AutoUseItemsSouringMP_val.value
		|| (Me.IsInvisible && !Me.CanUseAbilitiesInInvisibility && !AutoUseItemsSouringInvis.value)
	) {
		return true
	}
	if (ability.ManaCost <= AutoUseItemsSouringMPUse_val.value) {
		return true
	}
	Me.CastNoTarget(Items.SoulRing)
	let Delay = ability.CastPoint <= 0
		? Base.GetDelayCast
		: (ability.CastPoint * 1000) + Base.GetDelayCast
	TickSleep.Sleep(Delay)
	if (TickSleep.Sleeping) {
		args.Execute()
		return false
	}
	return true
}

function UsePowerTreads(args: ExecuteOrder, ability: Ability, unit: Unit, Items: InitItems): boolean {
	if (ability.ManaCost < 1 || unit.IsInvisible || TickSleep.Sleeping)
		return true

	if (ability.Name === "item_manta"
		|| ability.Name === "item_invis_sword"
		|| ability.Name === "item_silver_edge"
		|| ability.Name === "ember_spirit_sleight_of_fist"
		|| ability.Name === "morphling_adaptive_strike_agi"
	) {
		return true
	}
	if (Items.PowerTreads === undefined || !ItemsForUse.IsEnabled(Items.PowerTreads.Name))
		return true
	if (unit.IsStunned || unit.IsHexed || unit.IsInvulnerable)
		return true
	if (changed)
		lastStat = Items.ActiveAttribute
	if (Items.ActiveAttribute == Attributes.DOTA_ATTRIBUTE_STRENGTH) {
		unit.CastNoTarget(Items.PowerTreads)
		TickSleep.Sleep(Base.GetDelayCast)
	} else if (Items.ActiveAttribute == Attributes.DOTA_ATTRIBUTE_INTELLECT) {
		unit.CastNoTarget(Items.PowerTreads)
		unit.CastNoTarget(Items.PowerTreads)
		TickSleep.Sleep(Base.GetDelayCast)
	}
	changed = false
	nextTick = ((Game.RawGameTime + ability.CastPoint) + (0.45 + GetAvgLatency(Flow_t.OUT)))
	TickSleep.Sleep(nextTick)
	if (TickSleep.Sleeping) {
		args.Execute()
		return false
	}
	return true
}

export function UseMouseItemTarget(args: ExecuteOrder) {
	if (!StateBase.value || !State.value || TickSleep.Sleeping) {
		return true
	}
	let unit = args.Unit as Unit,
		target = args.Target as Unit

	if (target === undefined || unit === undefined) {
		return true
	}
	if (target.IsBuilding)
		return true
	switch (args.OrderType) {
		case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
			let Items = initItemsMap.get(unit)
			if (Items === undefined)
				return
			let _Item = Items.SolarCrest === undefined
				? Items.Medallion
				: Items.SolarCrest
			// console.log(unit.Buffs.map(e => e.Name))
			if (IsValidItem(Items.SolarCrest) || IsValidItem(Items.Medallion)
				&& unit.IsInRange(target, _Item.CastRange)
				&& !target.IsMagicImmune) {
				if (AutoUseItemsMedal_val.selected_id === 1 && target.IsEnemy()
					|| AutoUseItemsMedal_val.selected_id === 2 && !target.IsEnemy())
					return true
				unit.CastTarget(_Item, target)
				TickSleep.Sleep(Base.GetDelayCast)
			}
			if (!target.IsEnemy())
				return true
			if (target.IsHero && IsValidItem(Items.Janggo)
				&& unit.IsInRange(target, Items.Janggo.CastRange / 2)
				&& !unit.HasBuffByName("modifier_item_ancient_janggo_active")
			) {
				unit.CastNoTarget(Items.Janggo)
				TickSleep.Sleep(Base.GetDelayCast)
			}
			if (target.IsCreep
				&& (target.IsNeutral || (target.IsLaneCreep && AutoUseItemsTalon_val.selected_id === 1))
				&& !target.IsHero
				&& !target.IsAncient
				&& target.HPPercent <= AutoUseItemsTalonCreepHP.value
				&& IsValidItem(Items.Talon)
				&& unit.IsInRange(target, Items.Talon.CastRange)
			) {
				unit.CastTarget(Items.Talon, target)
				TickSleep.Sleep(Base.GetDelayCast)
			}
			if (target.IsHero && !target.IsMagicImmune
				&& IsValidItem(Items.DiffusalBlade)
				&& unit.IsInRange(target, Items.DiffusalBlade.CastRange)
				&& !target.HasBuffByName("modifier_item_diffusal_blade_slow")
			) {
				let hex_debuff = target.GetBuffByName("modifier_sheepstick_debuff")
				if ((hex_debuff === undefined || !hex_debuff.IsValid
					|| hex_debuff.RemainingTime <= 0.3)) {
					unit.CastTarget(Items.DiffusalBlade, target)
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
	let Items = new InitItems(unit)
	if (Items === undefined)
		return true
	let ability = args.Ability as Ability
	if (args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION
		&& args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET
		&& args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE
		&& args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET
		&& args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE) {
		return true
	}
	if (!UseSoulRing(unit, Items, ability, args) || !UsePowerTreads(args, ability, unit, Items))
		return false

	return true
}

export function Init() {
	if (!StateBase.value || TickSleep.Sleeping || !State.value)
		return
	_InitItems()
	if (EntityManager.GetEntitiesByClass(Unit, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY).some(AutoUseItems))
		return
}

export function _InitItems() {
	let Units = EntityManager.GetEntitiesByClass(Unit, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY)
	if (ParticleGlimer.size !== 0 || glimer.size !== 0)
		setTimeout(() => GlimerClear(), 2000)
	Units.forEach(x => {
		if (!x.IsAlive || !x.IsControllable)
			return
		let initItems = initItemsMap.get(x)
		if (initItems === undefined) {
			initItems = new InitItems(x)
			initItemsMap.set(x, initItems)
		}
	})
}

export function GameEnded() {
	changed = true
	nextTick = undefined
	lastStat = undefined
	TickSleep.ResetTimer()
}