import { ArrayExtensions, Entity, Game, Hero, LocalPlayer, EventsSDK, TickSleeper, EntityManager, WardObserver } from "wrapper/Imports"
import { StateBase } from "../../abstract/MenuBase"
import ItemManagerBase from "../../abstract/Base"
import { Items, State, StateItems } from "./Menu"
let Sleep = new TickSleeper
let Base = new ItemManagerBase
let ward_list: Entity[] = []
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
	if (!StateBase.value || !State.value || !Game.IsInGame || Sleep.Sleeping)
		return
	let Me = LocalPlayer.Hero
	if (IsValidHero(Me))
		return
	let Wards = EntityManager.GetEntitiesByClass(WardObserver, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY),
		concat = [...ward_list, ...Wards]
	Me.Inventory.GetItemsByNames(Items).filter(item =>
		item !== undefined
		&& StateItems.IsEnabled(item.Name)
		&& item.IsReady
		&& item.CanBeCasted(),
	).some(item => concat.filter(ent => ent.IsEnemy() && ent.IsAlive && ent.IsVisible && ent.IsInRange(Me, item.CastRange)).some(ent => {
		if (ent.Name === "npc_dota_techies_remote_mine" && (item.Name === "item_tango" || item.Name === "item_tango_single"))
			return false
		Me.CastTarget(item, ent)
		Sleep.Sleep(Base.GetDelayCast)
		return true
	}))
}

EventsSDK.on("EntityCreated", ent => IsMines(ent) && ward_list.push(ent))
EventsSDK.on("EntityDestroyed", ent => IsMines(ent) && ArrayExtensions.arrayRemove(ward_list, ent))

export function GameEnded() {
	Sleep.ResetTimer()
}
