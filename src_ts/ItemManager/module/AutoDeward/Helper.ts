import { ArrayExtensions, Entity, Game, Hero, Item, LocalPlayer } from "wrapper/Imports"
import {
	State, StateItems,
} from "./Menu"

let ward_list: Entity[] = [],
	Items = [
		"item_quelling_blade",
		"item_bfury",
		"item_tango",
		"item_tango_single",
	]

function IsValidHero(Hero: Hero) {
	return Hero === undefined
	|| !Hero.IsAlive
	|| Hero.IsStunned
	|| LocalPlayer.ActiveAbility !== undefined
}

function IsDewardable(ent: Entity) {
	return ent.IsEnemy() && (
		ent.m_pBaseEntity instanceof CDOTA_NPC_Observer_Ward
		|| ent.m_pBaseEntity instanceof CDOTA_NPC_Observer_Ward_TrueSight
		|| (
			ent.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines
			&& (
				ent.Name === "npc_dota_techies_remote_mine"
				|| ent.Name === "npc_dota_techies_stasis_trap"
			)
		)
	)
}

export function EntityCreate(ent: Entity) {
	if (!State.value)
		return false
	if (IsDewardable(ent))
		ward_list.push(ent)
}

export function EntityDestroyed(ent: Entity) {
	if (IsDewardable(ent))
		ArrayExtensions.arrayRemove(ward_list, ent)
}

export function Tick() {
	if (!State.value || !Game.IsInGame || ward_list.length === 0)
		return false
	let Me = LocalPlayer.Hero
	if (IsValidHero(Me))
		return false
	Me.Inventory.GetItemsByNames(["item_quelling_blade", "item_bfury", "item_tango", "item_tango_single"]).filter(item =>
		item !== undefined
		&& StateItems.IsSelectedID(Items.indexOf(item.Name))
		&& item.IsReady
		&& item.CanBeCasted(),
	).some(item => ward_list.filter(ent => ent.IsAlive && ent.IsVisible && ent.IsInRange(Me, item.CastRange)).some(ent => {
		if (ent.Name === "npc_dota_techies_remote_mine" && (item.Name === "item_tango" || item.Name === "item_tango_single"))
			return false
		Me.CastTarget(item, ent)
		return true
	}))
}

export function GameEnded() {
	ward_list = []
}