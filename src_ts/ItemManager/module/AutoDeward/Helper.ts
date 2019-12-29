import { ArrayExtensions, Entity, LocalPlayer, EventsSDK, TickSleeper, WardObserver, EntityManager, Hero, Unit } from "wrapper/Imports"
import { StateBase } from "../../abstract/MenuBase"
import ItemManagerBase from "../../abstract/Base"
import { Items, State, StateItems } from "./Menu"

let Sleep = new TickSleeper()
let Base = new ItemManagerBase()
let ward_list: Entity[] = []

let IsValidUnit = (unit: Unit) => !unit.IsEnemy()
	&& unit.IsAlive
	&& unit.IsControllable
	&& !unit.IsIllusion
	&& !unit.IsInvulnerable && !unit.IsStunned && !unit.IsHexed

function IsInvalidMine(ent: Entity) {
	return ent.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines && ent.Name !== "npc_dota_techies_remote_mine" && ent.Name !== "npc_dota_techies_stasis_trap"
}

export function Tick() {
	if (LocalPlayer!.IsSpectator || !StateBase.value || !State.value || Sleep.Sleeping)
		return
	EntityManager.GetEntitiesByClass(Hero).some(hero => IsValidUnit(hero)
		&& hero.Inventory.GetItemsByNames(Items).filter(item =>
			item !== undefined
			&& !item.IsEnemy()
			&& StateItems.IsEnabled(item.Name)
			&& item.IsReady
			&& item.CanBeCasted(),
		).some(item => ward_list.filter(ent => !IsInvalidMine(ent) && ent.IsEnemy() && ent.IsAlive && ent.IsVisible && ent.IsInRange(hero, item.CastRange)
		).some(ent => {
			if (ent.Name === "npc_dota_techies_remote_mine" && (item.Name === "item_tango" || item.Name === "item_tango_single"))
				return false
			hero.CastTarget(item, ent)
			Sleep.Sleep(Base.GetDelayCast)
			return true
		})))
}

EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof WardObserver || ent.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines)
		ward_list.push(ent)
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof WardObserver || ent.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines)
		ArrayExtensions.arrayRemove(ward_list, ent)
})

export function GameEnded() {
	Sleep.ResetTimer()
}
