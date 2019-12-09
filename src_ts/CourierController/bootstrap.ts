
import { EventsSDK, Hero, Courier, TickSleeper, Unit, ArrayExtensions, DOTA_GameMode, Game } from "wrapper/Imports"
import { CourierBase } from "./Data/Helper"
import { State, StateBestPos } from "./Menu"

import { AutoSafe } from "./module/AutoSafe"
import { AutoDeliver } from "./module/AutoDeliver"
//import { AutoUseItems } from "./module/AutoUseItems"
import { MoveCourier, CourierBestPosition } from "./module/BestPosition"

export let Owner: Hero
export let allyCourier: Courier
export let EnemyHero: Hero[] = []
export let unit_anim: Unit[] = []

export const Sleep = new TickSleeper

export let OwnerIsValid = () => Owner !== undefined && Owner.IsAlive
//export let AutoUseCourierPosition: Map<number, Vector3> = new Map()

EventsSDK.on("Tick", () => {
	if (!State.value || Sleep.Sleeping || !OwnerIsValid() || !CourierBase.IsValidCourier(allyCourier))
		return
	if (AutoSafe())
		return
	if (AutoDeliver())
		return
	// if (AutoUseItems())
	// 	return
	if (CourierBestPosition())
		return
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
EventsSDK.on("GameStarted", hero => {
	if (Owner === undefined)
		Owner = hero
})
EventsSDK.on("GameEnded", () => {
	unit_anim = []
	EnemyHero = []
	Owner = undefined
	Sleep.ResetTimer()
	allyCourier = undefined
	//AutoUseCourierPosition.clear()
	CourierBase.AUTO_USE_ITEMS = false
	CourierBase.DELIVER_DISABLE = false
})
EventsSDK.on("EntityCreated", entity => {
	if (entity instanceof Hero)
		EnemyHero.push(entity)
	if (!(entity instanceof Courier) || entity.IsEnemy() || !entity.IsControllable)
		return
	if (!State.value)
		return
	allyCourier = entity
	if (Game.GameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO || !StateBestPos.value)
		return
	setTimeout(() => MoveCourier(), 1000)
})
EventsSDK.on("EntityDestroyed", ent => {
	if (allyCourier === ent)
		allyCourier = undefined
	if (ent instanceof Hero)
		ArrayExtensions.arrayRemove(EnemyHero, ent)
})
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
EventsSDK.on("UnitAnimation", unit => unit.IsEnemy() && unit_anim.push(unit))
EventsSDK.on("UnitAnimationEnd", unit => unit.IsEnemy() && ArrayExtensions.arrayRemove(unit_anim, unit))
