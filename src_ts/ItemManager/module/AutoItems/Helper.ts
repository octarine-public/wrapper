import { ArrayExtensions, Creep, Entity, GameSleeper, Item, LocalPlayer, TreeTemp, Unit, Game } from "wrapper/Imports"

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

let Units: Unit[] = [],
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
	sleeper = new GameSleeper,
	DelayCast = ((Game.Ping / 2) + 30) + 250

export function EntityCreate(Entity: Entity) {
	if (Entity instanceof Creep && Entity.IsCreep && !Entity.IsAncient) {
		AllCreeps.push(Entity)
	}
	if (
		Entity instanceof Unit
		&& !Entity.IsCourier
		&& !Entity.IsCreep
	){
		Units.push(Entity)
	}	
	if (Entity instanceof Unit && Entity.IsHero) {
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
		if (Units !== undefined && Units.length > 0) {
			ArrayExtensions.arrayRemove(Units, Entity)
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
		if (!unit.IsInRange(enemy.NetworkPosition, Item.CastRange)) {
			return false
		}
		if (CheckUnitForUrn(enemy, AutoUseItemsUrnAliesEnemyHP.value) && !enemy.IsIllusion
			&& !unit.Buffs.some(buff => buff.Name === "modifier_item_urn_heal" || buff.Name === "modifier_item_spirit_vessel_heal")) {
			unit.CastTarget(Item, enemy)
			sleeper.Sleep(DelayCast, Item.Name)
			return true
		}
	})
}

function AutoUseItems(unit: Unit) {	
	if (unit.IsEnemy() || !unit.IsValid || !unit.IsAlive || !unit.IsControllable || !IsValidUnit(unit)) {
		return false
	}
	unit.Inventory.GetItemsByNames(Items)
	.filter(item => 
		item !== undefined
		&& item.IsReady
		&& ItemsForUse.IsEnabled(item.Name)
		&& item.CanBeCasted())
	.some(Item => {
		if (Item.Name === "item_phase_boots") {
			if (!unit.IsMoving || unit.IdealSpeed >= Base.MaxMoveSpeed) {
				return false
			}
			let enemy_phase_in_position = AutoUseItemsPhaseBootsState.value
				? AllUnits.some(enemy => enemy.IsVisible && enemy.Team !== unit.Team
					&& unit.Distance2D(enemy.NetworkPosition) !== 0
					&& unit.Distance2D(enemy.NetworkPosition) <= AutoUseItemsPhase_val.value)
				: AutoUseItemsPhaseBootsState.value

			if (AutoUseItemsPhaseBootsState.value && enemy_phase_in_position) {
				unit.CastNoTarget(Item)
				sleeper.Sleep(DelayCast, Item.Name)
				return true
			}
			else if (!AutoUseItemsPhaseBootsState.value) {
				unit.CastNoTarget(Item)
				sleeper.Sleep(DelayCast, Item.Name)
				return true
			}
		}
		if (Item.Name === "item_mjollnir"){
			let enemy_mjolnir = AllUnits.some(enemy => enemy.IsVisible && enemy.Team !== unit.Team
				&& unit.Distance2D(enemy.NetworkPosition) !== 0
				&& unit.Distance2D(enemy.NetworkPosition) <= AutoUseItemsMjollnir_val.value)
			if (enemy_mjolnir) {
				unit.CastTarget(Item, unit)
				sleeper.Sleep(DelayCast, Item.Name)
				return true
			}
		}
		if (Item.Name === "item_magic_stick" || Item.Name === "item_magic_wand") {
			if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
				return false
			}
			if (unit.HPPercent < AutoUseItemsSticks_val.value) {
				unit.CastNoTarget(Item)
				sleeper.Sleep(DelayCast, Item.Name)
				return true
			}
		}
		if (Item.Name === "item_faerie_fire") {
			if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
				return false
			}
			if (unit.HP < AutoUseItemsFaerieFire_val.value) {
				unit.CastNoTarget(Item)
				sleeper.Sleep(DelayCast, Item.Name)
				return true
			}
		}
		if (Item.Name === "item_cheese") {
			if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
				return false
			}
			if (unit.HPPercent < AutoUseItemsCheese_val.value) {
				unit.CastNoTarget(Item)
				sleeper.Sleep(DelayCast, Item.Name)
				return true
			}
		}
		if (Item.Name === "item_arcane_boots") {
			if (unit.ManaPercent < AutoUseItemsArcane_val.value) {
				unit.CastNoTarget(Item)
				sleeper.Sleep(DelayCast, Item.Name)
				return true
			}
		}
		if (Item.Name === "item_mekansm" || Item.Name === "item_guardian_greaves") {
			AllUnits.some(allies => {
				if (!unit.IsInRange(allies.NetworkPosition, Item.AOERadius)) {
					return false
				}
				if (allies.Team !== unit.Team) {
					return false
				}
				if (!unit.Buffs.some(buff => buff.Name === "modifier_item_mekansm_noheal")
					&& (allies.HPPercent <= AutoUseItemsMG_val.value
						&& allies.IsAlive || unit.HPPercent <= AutoUseItemsMG_val.value
						&& unit.IsAlive)) 
				{
					unit.CastNoTarget(Item)
					sleeper.Sleep(DelayCast, Item.Name)
					return true
				}
			})
		}
		if (Item.Name === "item_bottle") {
			if (Item.CurrentCharges < 3) {
				return false
			}
			if (unit.Buffs.some(buff => buff.Name === "modifier_fountain_aura_buff")) {
				AllUnits.some(allies => {
					if (!unit.IsInRange(allies.NetworkPosition, Item.CastRange)) {
						return false
					}
					if (allies.Team !== unit.Team) {
						return false
					}
					if (!allies.IsInvulnerable && !unit.Buffs.some(buff => buff.Name === "modifier_bottle_regeneration")
						&& (allies.Mana !== allies.MaxMana || allies.HP !== allies.MaxHP)) {
						unit.CastTarget(Item, allies)
						sleeper.Sleep(DelayCast, Item.Name)
						return true
					}
				})
			}
		}
		if (Item.Name === "item_bottle") { 
			if (unit.HPPercent > AutoUseItemsBloodHP_val.value || unit.ManaPercent < AutoUseItemsBloodMP_val.value) {
				return false
			}
			unit.CastNoTarget(Item)
			sleeper.Sleep(DelayCast, Item.Name)
			return true
		}
		if (Item.Name === "item_buckler") {
			unit.CastNoTarget(Item)
			sleeper.Sleep(DelayCast, Item.Name)
			return true
		}
		if (Item.Name === "item_hand_of_midas") {
			if (AutoUseItemsMidas_CheckBIG.value) {
				let Creep = GetAllCreepsForMidas(unit, Item)
				if (Creep.length <= 0)
					return false
				Creep = ArrayExtensions.Sorter(Creep, "MaxHP", true)
				if (unit.Distance2D(Creep[0].Position) <= Item.CastRange && unit.CanAttack(Creep[0])) {
					unit.CastTarget(Item, Creep[0])
					sleeper.Sleep(DelayCast, Item.Name)
					return true
				}
			} else {
				GetAllCreepsForMidas(unit, Item)
				sleeper.Sleep(DelayCast, Item.Name)
				return true
			}
		}
		if (Item.Name === "item_urn_of_shadows" || Item.Name === "item_spirit_vessel") {
			if (CheckUnitForUrn(LocalPlayer.Hero, AutoUseItemsUrnAliesAlliesHP.value) && !unit.IsIllusion
				&& !LocalPlayer.Hero.Buffs.some(buff => buff.Name === "modifier_item_urn_heal" || buff.Name === "modifier_item_spirit_vessel_heal"))
				unit.CastTarget(Item, LocalPlayer.Hero)
			if (!AutoUseItemsUrnAlies.value)
				return false
			UnitCheckForAlliesEnemy(unit, Item, false)
			if (!AutoUseItemsUrnEnemy.value)
				return false
			UnitCheckForAlliesEnemy(unit, Item)
		}
		if (Item.Name === "item_dust") {
			if (unit.GetItemByName("item_gem"))
				return false
			let IsVisibly = AllUnits.some(enemy => unit.IsInRange(enemy.NetworkPosition, Item.CastRange)
				&& enemy.IsVisible && (enemy.InvisibleLevel > 0 || enemy.IsInvisible)
				&& enemy.Buffs.some(buff => Buffs.InvisDebuff.some(InvisDebuff => buff.Name === InvisDebuff))
				&& !AllUnits.some(allies => allies.GetItemByName("item_gem") && allies.Distance2D(enemy.Position) < 800))
			if (!IsVisibly)
				return false
			unit.CastNoTarget(Item)
			sleeper.Sleep(DelayCast, Item.Name)
			return true
		}
		if (Item.Name === "item_tango" || Item.Name === "item_tango_single") {
			let tr = Trees.find(x => x.IsInRange(unit, Item.CastRange))
			if (tr === undefined)
				return false
			unit.CastTargetTree(Item, tr, false, true)
			sleeper.Sleep(DelayCast, Item.Name)
			return true
		}
	})
}

export function Tick() {
	if (!StateBase.value || !State.value || SleepCHeck() || !Game.IsInGame || Game.IsPaused) {
		return false
	}
	Units.filter(x=> x !== undefined && !x.IsIllusion && x.IsAlive && AutoUseItems(x))
}

export function GameEnded() {
	Units = []
	Trees = []
	AllUnits = []
}

export function GameStart() {}
