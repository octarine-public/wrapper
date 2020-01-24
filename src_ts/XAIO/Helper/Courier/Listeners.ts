import { XAIOState } from "./Menu"
import { CourierHelper } from "./Helper"
import { CSODOTALobby } from "XAIO/Core/Game/Data"
import { Deliver, AutoSafe, BPosition } from "./module/index"
import { UnitsIsControllable, XAIOStateGlobal } from "XAIO/bootstrap"
import { EventsSDK, Courier, LocalPlayer, GameRules, TickSleeper, PlayerResource, Events } from "wrapper/Imports"

const ValidPlayerStateGame = () => LocalPlayer === undefined
	|| LocalPlayer!.IsSpectator || !GameRules?.IsInGame

export let BPTreadSleep = new TickSleeper()

function InitModule(courier: Courier) {
	Deliver(courier)
	AutoSafe(courier)
	BPosition(courier)
}

EventsSDK.on("Tick", () => {
	if (ValidPlayerStateGame() || !XAIOStateGlobal.value || !XAIOState.value)
		return
	let Couriers = UnitsIsControllable.filter(x => x instanceof Courier && CourierHelper.IsValidCourier(x)) as Courier[]
	if (Couriers.length === 0)
		return
	Couriers.forEach(InitModule)
})

function SharedFilter(number: number, obj: any) {
	if (CourierHelper.roles.length === 0)
		return
	let local_steamid = LocalPlayer !== undefined && PlayerResource !== undefined ? PlayerResource.PlayerData[LocalPlayer.PlayerID]?.SteamID ?? -1n : -1n
	CourierHelper.roles[number] = (obj as CSODOTALobby).members
		// loop-optimizer: KEEP
		.filter(member => member.id === local_steamid && local_steamid >= 0)
		// loop-optimizer: KEEP
		.map(member => member.lane_selection_flags)
}

Events.on("SharedObjectChanged", (id, reason, uuid, obj) => {
	let time = GameRules?.RawGameTime ?? 0
	if (id !== 2004 || !XAIOStateGlobal.value || !XAIOState.value || LocalPlayer === undefined || time >= 700)
		return
	SharedFilter(0, obj)
	SharedFilter(1, obj)
})

EventsSDK.on("Tick", () => {
	if (ValidPlayerStateGame()
		|| !XAIOStateGlobal.value
		|| !XAIOState.value
		|| BPTreadSleep.Sleeping)
		return

	CourierHelper.LAST_CLICK = false
	BPTreadSleep.Sleep(CourierHelper.CastDelay)
})

EventsSDK.on("GameEnded", () => {
	BPTreadSleep.ResetTimer()
	CourierHelper.roles = []
	CourierHelper.LAST_CLICK = false
	CourierHelper.DELIVER_DISABLE = false
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
