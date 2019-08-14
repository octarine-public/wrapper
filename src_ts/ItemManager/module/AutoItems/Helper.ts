import {  ArrayExtensions, Creep, Entity, Game, Item, LocalPlayer, Unit } from "wrapper/Imports"

import {
	AutoUseItemsArcane_val, AutoUseItemsBloodHP_val,
	AutoUseItemsBloodMP_val,
	AutoUseItemsCheese_val,
	AutoUseItemsFaerieFire_val,
	AutoUseItemsMG_val,
	AutoUseItemsMidas_CheckBIG,
	AutoUseItemsMidas_range,
	AutoUseItemsSticks_val,
	AutoUseItemsUrnAlies,
	AutoUseItemsUrnAliesAlliesHP,
	AutoUseItemsUrnAliesEnemyHP,
	AutoUseItemsUrnEnemy,
	ItemsForUse,
	State,
} from "./Menu"

let UnitsControllable: Unit[] = [],
	AllUnits: Unit[] = [],
	AllCreeps: Creep[] = []

// loop-optimizer: KEEP
let Items: string[] = [
	"item_phase_boots",
	"item_magic_stick",
	"item_magic_wand",
	"item_hand_of_midas",
	"item_arcane_boots",
	"item_mekansm",
	"item_guardian_greaves",
	"item_bottle",
	"item_urn_of_shadows",
	"item_spirit_vessel",
	"item_bloodstone",
	"item_faerie_fire",
	"item_dust",
	"item_buckler",
	"item_cheese",
]
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

export function EntityCreate(Entity: Entity) {
	if (Entity instanceof Creep && Entity.IsCreep && !Entity.IsAncient)
		AllCreeps.push(Entity)

	if (Entity instanceof Unit && Entity.IsValid
		&& Entity.IsControllable && !Entity.IsCourier && !Entity.IsCreep &&
		(!Entity.IsIllusion || Entity.Name === "npc_dota_hero_arc_warden"))
			UnitsControllable.push(Entity)

	if (Entity instanceof Unit && Entity.IsHero &&
		(!Entity.IsIllusion || Entity.Name !== "npc_dota_hero_arc_warden"))
		AllUnits.push(Entity)
}

function Сompare(NameFind: string) {
	return Items.find(item_array => item_array === NameFind)
}

function IsValidUnit(unit: Unit) {
	let IgnoreBuffs = unit.Buffs.some(buff => buff.Name === "modifier_smoke_of_deceit")
	return unit !== undefined && unit.IsEnemy && unit.IsAlive && !unit.IsStunned && !unit.IsChanneling
		&& (unit.Name === "npc_dota_hero_riki" || unit.InvisibleLevel <= 0 || IgnoreBuffs)
}
function GetAllCreepsForMidas(Unit: Unit, Item: Item): Creep[] {
	return AllCreeps.filter(Creep => {
		if (Creep !== undefined
			&& !Creep.IsMagicImmune
			&& Creep.IsEnemy
			&& !Creep.IsAncient
			&& Creep.IsValid
			&& Creep.IsAlive
			&& !Creep.IsControllable
			&& Creep.IsVisible
			&& Creep.Team !== Unit.Team
			&& Unit.Distance2D(Creep.Position) <= Item.CastRange * 1.2) {
			if (!AutoUseItemsMidas_CheckBIG.value) {
				if (AutoUseItemsMidas_range.value) {
					if (!Creep.IsMelee) {
						Unit.CastTarget(Item, Creep)
					}
				} else Unit.CastTarget(Item, Creep)
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
			&& !unit.Buffs.some(buff => buff.Name === "modifier_item_urn_heal" || buff.Name === "modifier_item_spirit_vessel_heal"))
			unit.CastTarget(Item, enemy)
	})
}

let LastUpdateTime: number = 0
function AutoUseItems(unit: Unit) {
	if (!IsValidUnit(unit))
		return false
	let ItemSlot = unit.Inventory.GetItems(0, 5)
	ItemSlot.filter(items => Сompare(items.Name) !== undefined).map(Item => {
		if (!Item.CanBeCasted())
			return false
		switch (Item.Name) {
			case "item_phase_boots":
				if (!ItemsForUse.selected_flags[0])
					return false
				if (!unit.IsMoving)
					return false
				unit.CastNoTarget(Item)
				break
			case "item_magic_stick":
			case "item_magic_wand":
				if (!ItemsForUse.selected_flags[1])
					return false
				if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HPPercent < AutoUseItemsSticks_val.value)
					unit.CastNoTarget(Item)
				break
			case "item_faerie_fire":
				if (!ItemsForUse.selected_flags[2])
					return false
				if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HP < AutoUseItemsFaerieFire_val.value)
					unit.CastNoTarget(Item)
				break
			case "item_cheese":
				if (!ItemsForUse.selected_flags[3])
					return false
				if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HPPercent < AutoUseItemsCheese_val.value)
					unit.CastNoTarget(Item)
				break
			case "item_arcane_boots":
				if (!ItemsForUse.selected_flags[4])
					return false
				if (unit.ManaPercent < AutoUseItemsArcane_val.value)
					unit.CastNoTarget(Item)
				break
			case "item_mekansm":
			case "item_guardian_greaves":
				if (!ItemsForUse.selected_flags[5])
					return false
				AllUnits.some(allies => {
					if (!unit.IsInRange(allies.NetworkPosition, Item.AOERadius))
						return false
					if (allies.Team !== unit.Team)
						return false
					if (!unit.Buffs.some(buff => buff.Name === "modifier_item_mekansm_noheal")
						&& (allies.HPPercent <= AutoUseItemsMG_val.value && allies.IsAlive ||
						unit.HPPercent <= AutoUseItemsMG_val.value && unit.IsAlive))
						unit.CastNoTarget(Item)
				})
				break
			case "item_bottle":
				if (!ItemsForUse.selected_flags[6])
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
							&& (allies.Mana !== allies.MaxMana || allies.HP !== allies.MaxHP))
							unit.CastTarget(Item, allies)
					})
				}
				break
			case "item_bloodstone":
				if (!ItemsForUse.selected_flags[7])
					return false
				if (unit.HPPercent > AutoUseItemsBloodHP_val.value || unit.ManaPercent < AutoUseItemsBloodMP_val.value)
					return false
				unit.CastNoTarget(Item)
				break
			case "item_buckler":
				if (!ItemsForUse.selected_flags[8])
					return false
				unit.CastNoTarget(Item)
				break
			case "item_hand_of_midas":
				if (!ItemsForUse.selected_flags[9])
					return false
				if (AutoUseItemsMidas_CheckBIG.value) {
					var Creep = GetAllCreepsForMidas(unit, Item)
					if (Creep.length === 0)
						return false
					Creep = ArrayExtensions.Sorter(Creep, "MaxHP", true)
					if (unit.Distance2D(Creep[0].Position) <= Item.CastRange)
						unit.CastTarget(Item, Creep[0])
				} else
					GetAllCreepsForMidas(unit, Item)
				break
			case "item_urn_of_shadows":
			case "item_spirit_vessel":
				if (!ItemsForUse.selected_flags[10])
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
				if (!ItemsForUse.selected_flags[11])
					return false
				if (unit.GetItemByName("item_gem"))
					return false
				AllUnits.some(enemy => {
					if (unit.IsInRange(enemy.NetworkPosition, Item.CastRange)
						&& enemy.IsVisible
						&& (enemy.InvisibleLevel > 0 || enemy.IsInvisible)
						&& enemy.Buffs.some(buff => Buffs.InvisDebuff.some(InvisDebuff => buff.Name === InvisDebuff))
						&& !AllUnits.some(allies => allies.GetItemByName("item_gem") && allies.Distance2D(enemy.Position) < 800)) {
						unit.CastNoTarget(Item)
					}
				})
				break
			default:
				break
		}
		return true
	})
	return false
}

export function Tick() {
	if (!State.value || (Game.RawGameTime - LastUpdateTime) < 0.03 + (GetLatency(Flow_t.IN) + GetLatency(Flow_t.OUT)))
		return false
	LastUpdateTime = Game.RawGameTime
	if (!UnitsControllable.some(unit => AutoUseItems(unit)))
		return false
}

export function GameEnded() {
	AllUnits = []
	UnitsControllable = []
	LastUpdateTime = 0
}

export function GameStart() {
	LastUpdateTime = 0
}
