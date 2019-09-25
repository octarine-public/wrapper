import { ArrayExtensions, Creep, Entity, GameSleeper, Item, LocalPlayer, TreeTemp, Unit } from "wrapper/Imports"

import {
	AutoUseItemsArcane_val, AutoUseItemsBloodHP_val,
	AutoUseItemsBloodMP_val,
	AutoUseItemsCheese_val,
	AutoUseItemsFaerieFire_val,
	AutoUseItemsMG_val,
	AutoUseItemsMidas_CheckBIG,
	AutoUseItemsMidas_range,
	AutoUseItemsMjollnir_val,
	AutoUseItemsPhase_val,
	AutoUseItemsPhaseBootsState,
	AutoUseItemsSticks_val,
	AutoUseItemsUrnAlies,
	AutoUseItemsUrnAliesAlliesHP, AutoUseItemsUrnAliesEnemyHP,
	AutoUseItemsUrnEnemy, Items,
	ItemsForUse,
	State,
} from "./Menu"

import ItemManagerBase from "../../abstract/Base"
import { StateBase } from "../../abstract/MenuBase"

let UnitsControllable: Unit[] = [],
	AllUnits: Unit[] = [],
	AllCreeps: Creep[] = [],
	Trees: TreeTemp[] = []

let Buffs = {
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
	],
}

let Base = new ItemManagerBase,
	sleeper = new GameSleeper

export function EntityCreate(Entity: Entity) {
	if (Entity instanceof Creep && Entity.IsCreep && !Entity.IsAncient) {
		AllCreeps.push(Entity)
	}
	if (
		Entity instanceof Unit
		&& !Entity.IsCourier
		&& !Entity.IsCreep
		&& Entity.IsControllable
		&& (!Entity.IsIllusion || Entity.Name === "npc_dota_hero_arc_warden")
	)
		UnitsControllable.push(Entity)
	if (
		Entity instanceof Unit
		&& Entity.IsHero
		&& (!Entity.IsIllusion || Entity.Name !== "npc_dota_hero_arc_warden")
	) {
		AllUnits.push(Entity)
	}
	if (Entity instanceof TreeTemp) {
		Trees.push(Entity)
	}
}

export function EntityCreateDestroy(Entity: Entity) {
	if (Entity instanceof TreeTemp) {
		if (Trees !== undefined && Trees.length > 0) {
			ArrayExtensions.arrayRemove(Trees, Entity)
		}
	}
	if (Entity instanceof Creep) {
		if (AllCreeps !== undefined && AllCreeps.length > 0) {
			ArrayExtensions.arrayRemove(AllCreeps, Entity)
		}
	}
	if (Entity instanceof Unit) {
		if (UnitsControllable !== undefined && UnitsControllable.length > 0) {
			ArrayExtensions.arrayRemove(UnitsControllable, Entity)
		}
		if (AllUnits !== undefined && AllUnits.length > 0) {
			ArrayExtensions.arrayRemove(AllUnits, Entity)
		}
	}
}

function Сompare(NameFind: string) {
	return Items.find(item_array => item_array === NameFind)
}

function SleepCHeck() {
	return sleeper.Sleeping("item_phase_boots") ||
		sleeper.Sleeping("item_faerie_fire") ||
		sleeper.Sleeping("item_magic_stick") ||
		sleeper.Sleeping("item_magic_wand") ||
		sleeper.Sleeping("item_hand_of_midas") ||
		sleeper.Sleeping("item_arcane_boots") ||
		sleeper.Sleeping("item_mekansm") ||
		sleeper.Sleeping("item_guardian_greaves") ||
		sleeper.Sleeping("item_bottle") ||
		sleeper.Sleeping("item_urn_of_shadows") ||
		sleeper.Sleeping("item_spirit_vessel") ||
		sleeper.Sleeping("item_bloodstone") ||
		sleeper.Sleeping("item_tango") ||
		sleeper.Sleeping("item_tango_single") ||
		sleeper.Sleeping("item_faerie_fire") ||
		sleeper.Sleeping("item_dust") ||
		sleeper.Sleeping("item_buckler") ||
		sleeper.Sleeping("item_cheese") ||
		sleeper.Sleeping("item_mjollnir")
}

function IsValidUnit(unit: Unit) {
	let IgnoreBuffs = unit.Buffs.some(buff => buff.Name === "modifier_smoke_of_deceit")
	return unit !== undefined && unit.IsEnemy && unit.IsAlive && !unit.IsStunned && !unit.IsChanneling
		&& (unit.Name === "npc_dota_hero_riki" || unit.InvisibleLevel <= 0 || IgnoreBuffs)
}

function GetAllCreepsForMidas(Unit: Unit, Item: Item): Creep[] {
	return AllCreeps.filter(Creep => {
		if (Creep !== undefined
			&& Unit.CanAttack(Creep)
			&& !Creep.IsMagicImmune
			&& Creep.IsEnemy
			&& !Creep.IsAncient
			&& Creep.IsValid
			&& Creep.IsAlive
			&& !Creep.IsControllable
			&& Creep.IsVisible
			&& Creep.Team !== Unit.Team
			&& Unit.Distance2D(Creep.Position) <= Item.CastRange) {
			if (!AutoUseItemsMidas_CheckBIG.value) {
				if (AutoUseItemsMidas_range.value) {
					if (!Creep.IsMelee) {
						Unit.CastTarget(Item, Creep)
					}
				} else {
					Unit.CastTarget(Item, Creep)
				}
				return false
			}
			return AutoUseItemsMidas_range.value ? !Creep.IsMelee : true
		}
		return false
	})
}

function CheckUnitForUrn(Unit: Unit, MaxHP: number) {
	return Unit.IsAlive && Unit.HP <= MaxHP && !Unit.IsInvulnerable
		&& !Unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))
}

function UnitCheckForAlliesEnemy(unit: Unit, Item: Item, IsEnemy: boolean = true) {
	AllUnits.some(enemy => {
		if (IsEnemy) {
			if (enemy.Team === unit.Team)
				return false
		}else {
			if (enemy.Team !== unit.Team)
				return false
		}
		if (!unit.IsInRange(enemy.NetworkPosition, Item.CastRange))
			return false
		if (CheckUnitForUrn(enemy, AutoUseItemsUrnAliesEnemyHP.value) && !enemy.IsIllusion
			&& !unit.Buffs.some(buff => buff.Name === "modifier_item_urn_heal" || buff.Name === "modifier_item_spirit_vessel_heal")) {
			unit.CastTarget(Item, enemy)
			sleeper.Sleep(350, Item.Name)
		}
	})
}

function AutoUseItems(unit: Unit) {
	if (!unit.IsValid || !unit.IsAlive || !unit.IsControllable || !IsValidUnit(unit))
		return false
	let ItemSlot = unit.Inventory.GetItems(0, 5)
	ItemSlot.filter(items => Сompare(items.Name) !== undefined).map(Item => {
		if (!Item.CanBeCasted())
			return false
		switch (Item.Name) {
			case "item_phase_boots":
				if (!ItemsForUse.IsEnabled(Item.Name) || !unit.IsMoving || unit.IdealSpeed >= Base.MaxMoveSpeed)
					return false
				let enemy_phase = AutoUseItemsPhaseBootsState.value
					? AllUnits.some(enemy => enemy.IsVisible && enemy.Team !== unit.Team
						&& unit.Distance2D(enemy.NetworkPosition) !== 0
						&& unit.Distance2D(enemy.NetworkPosition) <= AutoUseItemsPhase_val.value)
					: AutoUseItemsPhaseBootsState.value
				if(AutoUseItemsPhaseBootsState.value && enemy_phase) {
					unit.CastNoTarget(Item)
					sleeper.Sleep(350, Item.Name)
				}
				else if (!AutoUseItemsPhaseBootsState.value) {
					unit.CastNoTarget(Item)
					sleeper.Sleep(350, Item.Name)
				}
				break
			case "item_mjollnir":
				if (!ItemsForUse.IsEnabled(Item.Name))
					return false
				let enemy_mjolnir = AllUnits.some(enemy => enemy.IsVisible && enemy.Team !== unit.Team
					&& unit.Distance2D(enemy.NetworkPosition) !== 0
					&& unit.Distance2D(enemy.NetworkPosition) <= AutoUseItemsMjollnir_val.value)
				if (enemy_mjolnir) {
					unit.CastTarget(Item, unit)
					sleeper.Sleep(350, Item.Name)
				}
				break
			case "item_magic_stick":
			case "item_magic_wand":
				if (!ItemsForUse.IsEnabled(Item.Name))
					return false
				if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HPPercent < AutoUseItemsSticks_val.value) {
					unit.CastNoTarget(Item)
					sleeper.Sleep(350, Item.Name)
				}
				break
			case "item_faerie_fire":
				if (!ItemsForUse.IsEnabled(Item.Name))
					return false
				if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HP < AutoUseItemsFaerieFire_val.value) {
					unit.CastNoTarget(Item)
					sleeper.Sleep(350, Item.Name)
				}
				break
			case "item_cheese":
				if (!ItemsForUse.IsEnabled(Item.Name))
					return false
				if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HPPercent < AutoUseItemsCheese_val.value) {
					unit.CastNoTarget(Item)
					sleeper.Sleep(350, Item.Name)
				}
				break
			case "item_arcane_boots":
				if (!ItemsForUse.IsEnabled(Item.Name))
					return false
				if (unit.ManaPercent < AutoUseItemsArcane_val.value) {
					unit.CastNoTarget(Item)
					sleeper.Sleep(350, Item.Name)
				}
				break
			case "item_mekansm":
			case "item_guardian_greaves":
				if (!ItemsForUse.IsEnabled(Item.Name))
					return false
				AllUnits.some(allies => {
					if (!unit.IsInRange(allies.NetworkPosition, Item.AOERadius))
						return false
					if (allies.Team !== unit.Team)
						return false
					if (!unit.Buffs.some(buff => buff.Name === "modifier_item_mekansm_noheal")
						&& (allies.HPPercent <= AutoUseItemsMG_val.value && allies.IsAlive ||
						unit.HPPercent <= AutoUseItemsMG_val.value && unit.IsAlive)) {
						unit.CastNoTarget(Item)
						sleeper.Sleep(350, Item.Name)
					}
				})
				break
			case "item_bottle":
				if (!ItemsForUse.IsEnabled(Item.Name))
					return false
				if (Item.CurrentCharges < 3)
					return false
				if (unit.Buffs.some(buff => buff.Name === "modifier_fountain_aura_buff")) {
					AllUnits.some(allies => {
						if (!unit.IsInRange(allies.NetworkPosition, Item.CastRange))
							return false
						if (allies.Team !== unit.Team)
							return false
						if (!allies.IsInvulnerable && !unit.Buffs.some(buff => buff.Name === "modifier_bottle_regeneration")
							&& (allies.Mana !== allies.MaxMana || allies.HP !== allies.MaxHP)) {
							unit.CastTarget(Item, allies)
							sleeper.Sleep(350, Item.Name)
						}
					})
				}
				break
			case "item_bloodstone":
				if (!ItemsForUse.IsEnabled(Item.Name))
					return false
				if (unit.HPPercent > AutoUseItemsBloodHP_val.value || unit.ManaPercent < AutoUseItemsBloodMP_val.value)
					return false
				unit.CastNoTarget(Item)
				sleeper.Sleep(350, Item.Name)
				break
			case "item_buckler":
				if (!ItemsForUse.IsEnabled(Item.Name))
					return false
				unit.CastNoTarget(Item)
				sleeper.Sleep(350, Item.Name)
				break
			case "item_hand_of_midas":
				if (!ItemsForUse.IsEnabled(Item.Name))
					return false
				if (AutoUseItemsMidas_CheckBIG.value) {
					var Creep = GetAllCreepsForMidas(unit, Item)
					if (Creep.length === 0)
						return false
					Creep = ArrayExtensions.Sorter(Creep, "MaxHP", true)
					if (unit.Distance2D(Creep[0].Position) <= Item.CastRange && unit.CanAttack(Creep[0])) {
						unit.CastTarget(Item, Creep[0])
						sleeper.Sleep(350, Item.Name)
					}
				} else {
					GetAllCreepsForMidas(unit, Item)
					sleeper.Sleep(350, Item.Name)
				}
				break
			case "item_urn_of_shadows":
			case "item_spirit_vessel":
				if (!ItemsForUse.IsEnabled(Item.Name))
					return false
				if (CheckUnitForUrn(LocalPlayer.Hero, AutoUseItemsUrnAliesAlliesHP.value) && !unit.IsIllusion
					&& !LocalPlayer.Hero.Buffs.some(buff => buff.Name === "modifier_item_urn_heal" || buff.Name === "modifier_item_spirit_vessel_heal"))
					unit.CastTarget(Item, LocalPlayer.Hero)
				if (!AutoUseItemsUrnAlies.value)
					return false
				UnitCheckForAlliesEnemy(unit, Item, false)
				if (!AutoUseItemsUrnEnemy.value)
					return false
				UnitCheckForAlliesEnemy(unit, Item)
				break
			case "item_dust":
				if (!ItemsForUse.IsEnabled(Item.Name))
					return false
				if (unit.GetItemByName("item_gem"))
					return false
				let IsVisibly = AllUnits.some(enemy => unit.IsInRange(enemy.NetworkPosition, Item.CastRange)
					&& enemy.IsVisible && (enemy.InvisibleLevel > 0 || enemy.IsInvisible)
					&& enemy.Buffs.some(buff => Buffs.InvisDebuff.some(InvisDebuff => buff.Name === InvisDebuff))
					&& !AllUnits.some(allies => allies.GetItemByName("item_gem") && allies.Distance2D(enemy.Position) < 800))
				if (!IsVisibly)
					return false
				unit.CastNoTarget(Item)
				sleeper.Sleep(350, Item.Name)
				break
			case "item_tango":
			case "item_tango_single":
				if (!ItemsForUse.IsEnabled(Item.Name))
					return false
				let tr = Trees.find(x => x.IsInRange(unit, Item.CastRange))
				if (tr === undefined)
					return false
				unit.CastTargetTree(Item, tr, false, true)
				sleeper.Sleep(350, Item.Name)
				break
			default:
				break
		}
		return true
	})
	return false
}

export function Tick() {
	if (!StateBase.value || !State.value || SleepCHeck())
		return
	UnitsControllable.some(unit => !unit.IsEnemy() && AutoUseItems(unit))
}

export function GameEnded() {
	Trees = []
	AllUnits = []
	UnitsControllable = []
}

export function GameStart() {}
