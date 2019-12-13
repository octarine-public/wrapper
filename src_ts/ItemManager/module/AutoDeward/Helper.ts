import { ArrayExtensions, Entity, Game, Hero, LocalPlayer, EventsSDK, TickSleeper } from "wrapper/Imports"
import { StateBase } from "abstract/MenuBase"
import { Items, State, StateItems } from "Menu"
import ItemManagerBase from "abstract/Base"
import { Wards } from "Core/Listeners"
let Sleep = new TickSleeper
let Base = new ItemManagerBase
function IsValidHero(Hero: Hero) {
	return Hero === undefined
		|| !Hero.IsAlive
		|| Hero.IsStunned
		|| LocalPlayer.ActiveAbility !== undefined
}

function IsMines(ent: Entity) {
	return (ent.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines
		&& (
			ent.Name === "npc_dota_techies_remote_mine"
			|| ent.Name === "npc_dota_techies_stasis_trap"
		)
	)
}

export function Init() {
	if (!StateBase.value || !State.value || !Game.IsInGame || Wards.length === 0 || Sleep.Sleeping)
		return
	let Me = LocalPlayer.Hero
	if (IsValidHero(Me))
		return
	Me.Inventory.GetItemsByNames(Items).filter(item =>
		item !== undefined
		&& StateItems.IsEnabled(item.Name)
		&& item.IsReady
		&& item.CanBeCasted(),
	).some(item => Wards.filter(ent => ent.IsEnemy() && ent.IsAlive && ent.IsVisible && ent.IsInRange(Me, item.CastRange)).some(ent => {
		if (ent.Name === "npc_dota_techies_remote_mine" && (item.Name === "item_tango" || item.Name === "item_tango_single"))
			return false
		Me.CastTarget(item, ent)
		Sleep.Sleep(Base.GetDelayCast)
		return true
	}))
}
EventsSDK.on("EntityCreated", ent => IsMines(ent) && Wards.push(ent))
EventsSDK.on("EntityDestroyed", ent => IsMines(ent) && ArrayExtensions.arrayRemove(Wards, ent))
export function GameEnded() {
	Sleep.ResetTimer()
}
