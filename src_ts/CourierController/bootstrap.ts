
import { EventsSDK, Hero, TickSleeper, Game, Events, LocalPlayer, Courier, EntityManager, ArrayExtensions, Unit } from "wrapper/Imports"
import { State, StateBestPos } from "Menu"
import { CSODOTALobby } from "Data/Data"
import { CourierBase } from "Data/Helper"
import { AutoSafe } from "module/AutoSafe"
import { AutoDeliver } from "module/AutoDeliver"
//import { AutoUseItems } from "./module/AutoUseItems"
import { MoveCourier, CourierBestPosition } from "module/BestPosition"
export let Owner: Hero
export const Sleep = new TickSleeper
export let UnitAnimation: Unit[] = []
export let OwnerIsValid = () => Owner !== undefined && Owner.IsAlive
//export let AutoUseCourierPosition: Map<number, Vector3> = new Map()

EventsSDK.on("Tick", () => {
	if (!State.value || Sleep.Sleeping || !OwnerIsValid())
		return
	if (EntityManager.GetEntitiesByClass<Courier>(Courier, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY)
		.some(courier => !courier.IsEnemy() || !CourierBase.IsValidCourier(courier) || AutoDeliver(courier)
			|| CourierBestPosition(courier) || AutoSafe(courier)))
		return
	// if (AutoUseItems())
	// 	return
})
Events.on("SharedObjectChanged", (id, reason, uuid, obj) => {
	if (id !== 2004 || !State.value || LocalPlayer === undefined || Game.RawGameTime >= 700)
		return
	// loop-optimizer: KEEP
	CourierBase.roles[0] = (obj as CSODOTALobby).members.filter(member => member.id === LocalPlayer.PlayerSteamID).map(member => member.lane_selection_flags)
	// loop-optimizer: KEEP
	CourierBase.roles[1] = (obj as CSODOTALobby).members.filter(member => member.id === LocalPlayer.PlayerSteamID).map(member => member.lane_selection_flags)
})

EventsSDK.on("GameStarted", hero => {
	if (Owner === undefined)
		Owner = hero
	if (!StateBestPos.value)
		return
	setTimeout(() =>
		EntityManager.GetEntitiesByClass<Courier>(Courier, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY).some(courier =>
			!courier.IsEnemy() && MoveCourier(false, courier)), 1000)
})
EventsSDK.on("GameEnded", () => {
	Owner = undefined
	Sleep.ResetTimer()
	//AutoUseCourierPosition.clear()
	CourierBase.AUTO_USE_ITEMS = false
	CourierBase.DELIVER_DISABLE = false
})
EventsSDK.on("UnitAnimation", unit => {
	if (unit.IsEnemy())
		UnitAnimation.push(unit)
})
EventsSDK.on("UnitAnimationEnd", unit => {
	if (unit.IsEnemy())
		ArrayExtensions.arrayRemove(UnitAnimation, unit)
})
// EventsSDK.on("Draw", () => {
// 	// loop-optimizer: KEEP
// 	AutoUseCourierPosition.forEach(position => {
// 		let screen_pos = RendererSDK.WorldToScreen(position)
// 		if (screen_pos === undefined)
// 			return
// 		RendererSDK.Text("Spot", screen_pos, new Color(0, 255, 0))
// 		return
// 	})

// })
// EventsSDK.on("ParticleCreated", (id: number, path: string, handle: bigint) => {
// 	if (!OwnerIsValid() || AutoUseCourierPosition.size !== 0)
// 		return
// 	let TeamHandle = Owner.Team === Team.Dire ? 16411378985643724199n : 3845203473627057528n
// 	if (TeamHandle !== handle)
// 		return
// 	AutoUseCourierPosition.set(id, new Vector3)
// })
// EventsSDK.on("ParticleUpdated", (id: number, controlPoint: number, position: Vector3) => {
// 	if (AutoUseCourierPosition.size !== 0)
// 		return
// 	let ids = AutoUseCourierPosition.get(id)
// 	if (ids === undefined)
// 		return
// 	AutoUseCourierPosition.set(id, position)
// })
