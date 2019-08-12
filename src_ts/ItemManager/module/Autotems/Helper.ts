import {  Game, Unit, Entity, LocalPlayer } from "wrapper/Imports";

import { 
	State, ItemsForUse,
	AutoUseItemsSticks_val,
	AutoUseItemsCheese_val,
	AutoUseItemsArcane_val,
	AutoUseItemsFaerieFire_val, 
} from "./Menu"

let UnitsControllable: Unit[] = [],
	UnitAllies: Unit[] = [];

// loop-optimizer: KEEP
let Items: string[] = [
	'item_phase_boots',
	'item_magic_stick',
	'item_magic_wand',
	'item_hand_of_midas',
	'item_arcane_boots',
	'item_mekansm',
	'item_guardian_greaves',
	'item_bottle',
	'item_urn_of_shadows',
	'item_spirit_vessel',
	'item_bloodstone',
	'item_faerie_fire',
	'item_dust',
	'item_buckler',
	'item_cheese',
]
let Buffs = {
	NotHeal: [
		'modifier_fountain_aura_buff',
		'modifier_item_armlet_unholy_strength'
	]
}

export function EntityCreate(Entity: Entity){
	if (Entity instanceof Unit && Entity.IsValid
		&& Entity.IsControllable && !Entity.IsCourier && !Entity.IsCreep && 
		(!Entity.IsIllusion || Entity.Name === "npc_dota_hero_arc_warden"))
			UnitsControllable.push(Entity);

	if (Entity instanceof Unit && Entity.IsHero && 
		(!Entity.IsIllusion || Entity.Name !== "npc_dota_hero_arc_warden"))
		UnitAllies.push(Entity);
}

function Сompare(NameFind: string) {
	return Items.find(item_array => item_array === NameFind)
}

function IsValidUnit(unit: Unit) {
	let IgnoreBuffs = unit.Buffs.some(buff => buff.Name === "modifier_smoke_of_deceit")
	return unit !== undefined && unit.IsEnemy && unit.IsAlive && !unit.IsStunned && !unit.IsChanneling
		&& (unit.Name === 'npc_dota_hero_riki' || unit.InvisibleLevel <= 0 || IgnoreBuffs);
}

let LastUpdateTime: number = 0;
function AutoUseItems(unit: Unit, allies: Unit) {
	if (!IsValidUnit(unit))
		return false
	let ItemSlot = unit.Inventory.GetItems(0, 5);
	ItemSlot.filter(items => Сompare(items.Name) !== undefined).map(Item => {
		if (!Item.CanBeCasted())
			return false
		switch (Item.Name) {
			case 'item_phase_boots':
				if (!ItemsForUse.selected_flags[0])
					return false;
				if (!unit.IsMoving)
					return false;
				unit.CastNoTarget(Item)
			break
			case "item_magic_stick":
			case "item_magic_wand":
				if (!ItemsForUse.selected_flags[1])
					return false;
				if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HPPercent < AutoUseItemsSticks_val.value)
					unit.CastNoTarget(Item);
			break
			case "item_faerie_fire":
				if (!ItemsForUse.selected_flags[2])
					return false;
				if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HP < AutoUseItemsFaerieFire_val.value)
					unit.CastNoTarget(Item);
			break
			case "item_cheese":
				if (!ItemsForUse.selected_flags[3])
					return false;
				if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal)))
					return false
				if (unit.HPPercent < AutoUseItemsCheese_val.value)
					unit.CastNoTarget(Item);
			break
			case "item_arcane_boots":
				if (!ItemsForUse.selected_flags[4])
					return false;
				if (unit.ManaPercent < AutoUseItemsArcane_val.value)
					unit.CastNoTarget(Item);
			break
			case "item_mekansm":
			case "item_guardian_greaves":
				let Alies = unit.IsInRange(allies.NetworkPosition, Item.AOERadius);
				if (!Alies || unit.Index === allies.Index)
					return false
				// if (Alies.HPPercent <= AutoUse_Usage.MekaGraves.HP.State && Alies.IsAlive && !Allied.FindBuff('modifier_item_mekansm_noheal'))
				// console.log(Alies + " | " + unit.Name + " | " + allies.Name)

				///unit.CastNoTarget(Item);
			break;

		}
		return true
	})
	return false
}


export function Tick() {
	return false;
	if (!State.value || (Game.RawGameTime - LastUpdateTime) < 0.03 + (GetLatency(Flow_t.IN) + GetLatency(Flow_t.OUT)))
		return false
	LastUpdateTime = Game.RawGameTime;
	
	if (!UnitsControllable.some(unit => UnitAllies.some(allies => allies.Team === unit.Team && AutoUseItems(unit, allies))))
		return false
}

export function GameEnded() {
	UnitAllies = [];
	UnitsControllable = [];
	LastUpdateTime = 0;
}

export function GameStart() {
	LastUpdateTime = 0;
}