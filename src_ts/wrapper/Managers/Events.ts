import Color from "../Base/Color"
import QAngle from "../Base/QAngle"

import Vector3 from "../Base/Vector3"
import { default as EntityManager, LocalPlayer } from "./EntityManager"

import Entity from "../Objects/Base/Entity"
import Hero from "../Objects/Base/Hero"
import Modifier from "../Objects/Base/Modifier"
import Unit from "../Objects/Base/Unit"

import ExecuteOrder from "../Native/ExecuteOrder"
import UserCmd from "../Native/UserCmd"

const EventsSDK: EventsSDK = new EventEmitter()

export default EventsSDK

Events.on("GameStarted", ent => EventsSDK.emit("GameStarted", false, EntityManager.GetEntityByNative(ent)))

Events.on("GameEnded", () => EventsSDK.emit("GameEnded"))

Events.on("LocalPlayerTeamAssigned", teamNum => EventsSDK.emit("LocalPlayerTeamAssigned", false, teamNum))

Events.on("WndProc", (...args) => EventsSDK.emit("WndProc", true, ...args))

Events.on("Tick", () => {
	try {
		if (LocalPlayer !== undefined)
			EventsSDK.emit("Tick")
	} catch (e) {
		throw e
	}
})

Events.on("Update", cmd => EventsSDK.emit("Update", false, new UserCmd(cmd)))

Events.on("UnitStateChanged", npc => {
	if (LocalPlayer === undefined)
		return

	EventsSDK.emit("UnitStateChanged", false, EntityManager.GetEntityByNative(npc, true))
})

Events.on("TeamVisibilityChanged", (npc, newTagged) => {
	if (LocalPlayer === undefined)
		return

	const unit = EntityManager.GetEntityByNative(npc, true) as Unit

	const isVisibleForEnemies = Unit.IsVisibleForEnemies(unit, newTagged)
	unit.IsVisibleForEnemies = isVisibleForEnemies

	EventsSDK.emit("TeamVisibilityChanged", false, unit, isVisibleForEnemies, newTagged)
})

Events.on("Draw", () => EventsSDK.emit("Draw"))

Events.on("ParticleCreated", (id, path, particleSystemHandle, attach, target) =>
	EventsSDK.emit("ParticleCreated", false, id, path, particleSystemHandle, attach,
		target instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(target)
			: EntityManager.EntityByIndex(target)))

Events.on("ParticleUpdated", (id, control_point) =>
	EventsSDK.emit("ParticleUpdated", false, id, control_point, Vector3.fromIOBuffer()))

Events.on("ParticleUpdatedEnt", (id, control_point, ent, attach, attachment, include_wearables) =>
	EventsSDK.emit("ParticleUpdatedEnt", false, id, control_point,
		ent instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(ent)
			: ent,
		attach, attachment, Vector3.fromIOBuffer(), include_wearables))

Events.on("BloodImpact", (target, scale, xnormal, ynormal) =>
	EventsSDK.emit("BloodImpact", false,
		target instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(target)
			: target,
		scale, xnormal, ynormal))

Events.on("PrepareUnitOrders", order => {
	const ordersSDK = ExecuteOrder.fromNative(order)

	if (ordersSDK === undefined)
		return true

	return EventsSDK.emit("PrepareUnitOrders", true, ordersSDK)
})

Events.on("LinearProjectileCreated", (proj, ent, path, particleSystemHandle, max_speed, fow_radius, sticky_fow_reveal, distance) => {
	EventsSDK.emit (
		"LinearProjectileCreated", false,
		proj,
		ent instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(ent)
			: ent,
		path, particleSystemHandle, max_speed, fow_radius, sticky_fow_reveal, distance,
		Color.fromIOBuffer(),
	)
})

Events.on("LinearProjectileDestroyed", proj =>
	EventsSDK.emit("LinearProjectileDestroyed", false, proj))

Events.on("TrackingProjectileCreated", (proj, source, target, moveSpeed,sourceAttachment,path,particleSystemHandle,dodgeable,isAttack,expireTime,maximpacttime,launch_tick) =>{
	EventsSDK.emit("TrackingProjectileCreated", false, proj, 
		source instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(source)
			: source, 
		target instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(target)
			: target,
		moveSpeed,
		sourceAttachment,
		path,
		particleSystemHandle, dodgeable, isAttack, expireTime,maximpacttime,launch_tick)
})

Events.on("TrackingProjectileUpdated", (proj, path, particleSystemHandle, launch_tick) =>
	EventsSDK.emit("TrackingProjectileUpdated", false, Vector3.fromIOBuffer(), proj, path, particleSystemHandle, Color.fromIOBuffer(), launch_tick))

Events.on("TrackingProjectileDestroyed", proj =>
	EventsSDK.emit("TrackingProjectileDestroyed", false, proj))

Events.on("TrackingProjectilesDodged", (ent, attacks_only) => EventsSDK.emit (
	"TrackingProjectilesDodged",
	false,
	ent instanceof C_BaseEntity
		? EntityManager.GetEntityByNative(ent)
		: ent,
	attacks_only,
))

Events.on("UnitAnimation", (npc, sequenceVariant, playbackrate, castpoint, type, activity) =>
	EventsSDK.emit("UnitAnimation", false, EntityManager.GetEntityByNative(npc), sequenceVariant, playbackrate, castpoint, type, activity))

Events.on("UnitAnimationEnd", (npc, snap) =>
	EventsSDK.emit("UnitAnimationEnd", false, EntityManager.GetEntityByNative(npc), snap))

Events.on("CustomGameEvent", (...args) =>
	EventsSDK.emit("CustomGameEvent", false, ...args))

Events.on("UnitAnimationEnd", (npc, snap) =>
	EventsSDK.emit("UnitAnimationEnd", false, EntityManager.GetEntityByNative(npc), snap))

Events.on("UnitSpeech", (npc, concept, response, recipient_type, level, muteable) => {
	EventsSDK.emit (
		"UnitSpeech", false,
		npc instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(npc)
			: npc,
		concept, response, recipient_type, level, muteable,
	)
})

Events.on("UnitSpeechMute", (npc, delay) => {
	EventsSDK.emit (
		"UnitSpeechMute", false,
		npc instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(npc)
			: npc,
		delay,
	)
})

Events.on("UnitAddGesture", (npc, activity, slot, fade_in, fade_out, playback_rate, sequence_variant) => {
	EventsSDK.emit (
		"UnitAddGesture", false,
		npc instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(npc)
			: npc,
		activity, slot, fade_in, fade_out, playback_rate, sequence_variant,
	)
})

Events.on("UnitRemoveGesture", (npc, activity) => {
	EventsSDK.emit (
		"UnitRemoveGesture", false,
		npc instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(npc)
			: npc,
		activity,
	)
})

Events.on("UnitFadeGesture", (npc, activity) => {
	EventsSDK.emit (
		"UnitFadeGesture", false,
		npc instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(npc)
			: npc,
		activity,
	)
})

interface EventsSDK extends EventEmitter {
	/**
	 * Emitted when local hero and local player are available
	 *
	 * Also, emitted when scripts reloading
	 */
	on(name: "GameStarted", callback: (localHero: Hero) => void): EventEmitter
	/**
	 * Emitted when game ended
	 *
	 * Also, emitted when scripts reloading
	 */
	on(name: "GameEnded", callback: () => void): EventEmitter
	/**
	 * Emitted local player choose team. Now LocalPlayer is available and valid
	 */
	on(name: "LocalPlayerTeamAssigned", callback: (teamNum: DOTATeam_t) => void): EventEmitter
	/**
	 * Emitted about ALL entities that have may be in "Staging" and Is NOT Valid flag (NPC and childs, PhysicalItems and etc.)
	 *
	 * Also, this event emitted about ALL entities that have already been created before reloading scripts
	 *
	 * Emitted ONLY after LocalPlayer created
	 *
	 * CAREFUL !Use this if you know what you are doing!
	 */
	on(name: "EntityPreCreated", callback: (ent: Entity, index: number) => void): EventEmitter
	/**
	 * Emitted about ALL entities that have Valid flag. This callback is best suited for use.
	 *
	 * Also, this event emitted about ALL entities that have already been created (and valids) before reloading scripts
	 *
	 * Emitted ONLY after LocalPlayer created
	 */
	on(name: "EntityCreated", callback: (ent: Entity, index: number) => void): EventEmitter
	on(name: "EntityDestroyed", callback: (ent: Entity, index: number) => void): EventEmitter
	/**
	 * Analog (w/o hwnd) - https://docs.microsoft.com/en-us/previous-versions/windows/desktop/legacy/ms633573(v%3Dvs.85)
	 *
	 * messageType: https://www.autoitscript.com/autoit3/docs/appendix/WinMsgCodes.htm
	 */
	on(name: "WndProc", callback: (messageType: number, wParam: bigint, lParam: bigint) => false | any): EventEmitter
	/**
	 * Every ~33ms. Emitted after LocalPlayer has been created
	 */
	on(name: "Tick", callback: () => void): EventEmitter
	on(name: "Update", callback: (cmd: UserCmd) => void): EventEmitter
	on(name: "UnitStateChanged", callback: (npc: Unit) => void): EventEmitter
	on(name: "TeamVisibilityChanged", callback: (npc: Unit, isVisibleForEnemies: boolean, isVisibleForTeamMask: number) => void): EventEmitter
	on(name: "TrueSightedChanged", callback: (npc: Unit, isTrueSighted: boolean) => void): EventEmitter
	on(name: "HasScepterChanged", callback: (npc: Unit, hasScepter: boolean) => void): EventEmitter
	on(name: "Draw", callback: () => void): EventEmitter
	on(name: "ParticleCreated", callback: (id: number, path: string, particleSystemHandle: bigint, attach: ParticleAttachment_t, target?: Entity) => void): EventEmitter
	on(name: "ParticleUpdated", callback: (id: number, controlPoint: number, position: Vector3) => void): EventEmitter
	on(name: "ParticleUpdatedEnt", callback: (
		id: number,
		controlPoint: number,
		ent: Entity | number,
		attach: ParticleAttachment_t,
		attachment: number,
		fallbackPosition: Vector3,
		includeWearables: boolean,
	) => void): EventEmitter
	on(name: "BloodImpact", callback: (target: Entity | number, scale: number, xnormal: number, ynormal: number) => void): EventEmitter
	on(name: "PrepareUnitOrders", callback: (order: ExecuteOrder) => false | any): EventEmitter
	on(name: "LinearProjectileCreated", callback: (
		proj: LinearProjectile,
		ent: Entity | number,
		path: string,
		particleSystemHandle: bigint,
		maxSpeed: number,
		fowRadius: number,
		stickyFowReveal: boolean,
		distance: number,
		colorgemcolor: Color,
	) => void): EventEmitter
	on(name: "LinearProjectileDestroyed", callback: (proj: LinearProjectile) => void): EventEmitter
	on(name: "TrackingProjectileCreated", callback: (
		proj: number, 
		source: Unit|number, 
		target: Unit|number,
		moveSpeed: number,
		sourceAttachment: number,
		path: string,
		particleSystemHandle:bigint, 
		dodgeable:boolean, 
		isAttack:boolean, 
		expireTime:number,
		maximpacttime:number,
		launch_tick:number
	) => void): EventEmitter
	on(name: "TrackingProjectileUpdated", callback: (
		proj: TrackingProjectile,
		vSourceLoc: Vector3,
		path: string,
		particleSystemHandle: bigint,
		colorgemcolor: Color,
		launchTick: number,
	) => void): EventEmitter
	on(name: "TrackingProjectileDestroyed", callback: (proj: TrackingProjectile) => void): EventEmitter
	on(name: "TrackingProjectilesDodged", callback: (ent: Entity | number, attacks_only: boolean) => void): EventEmitter
	on(name: "UnitAnimation", callback: (
		npc: Unit,
		sequenceVariant: number,
		playbackrate: number,
		castpoint: number,
		type: number,
		activity: number,
	) => void): EventEmitter
	on(name: "UnitAnimationEnd", callback: (
		npc: Unit,
		snap: boolean,
	) => void): EventEmitter
	/**
	 *	Also, this event emitted about ALL buffs(modifiers) that have already been created (and valids) before reloading scripts
	 */
	on(name: "BuffAdded", listener: (npc: Unit, buff: Modifier) => void): EventEmitter
	on(name: "BuffRemoved", listener: (npc: Unit, buff: Modifier) => void): EventEmitter
	on(name: "BuffStackCountChanged", listener: (buff: Modifier) => void): EventEmitter
	on(name: "CustomGameEvent", listener: (event_name: string, obj: any) => void): EventEmitter
	//on(name: "NetworkFieldChanged", listener: (object: any, name: string) => void): EventEmitter
	on(name: "UnitSpeech", listener: (
		npc: Unit | number,
		concept: number,
		response: string,
		recipient_type: number,
		level: number,
		muteable: boolean,
	) => void): EventEmitter
	on(name: "UnitSpeechMute", listener: (npc: Unit | number, delay: number) => void): EventEmitter
	on(name: "UnitAddGesture", listener: (
		npc: Unit | number,
		activity: number,
		slot: number,
		fade_in: number,
		fade_out: number,
		playback_rate: number,
		sequence_variant: number,
	) => void): EventEmitter
	on(name: "UnitRemoveGesture", listener: (npc: Unit | number, activity: number) => void): EventEmitter
	on(name: "UnitFadeGesture", listener: (npc: Unit | number, activity: number) => void): EventEmitter
}
