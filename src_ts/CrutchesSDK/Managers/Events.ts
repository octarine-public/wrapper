import QAngle from "../Base/QAngle";
import Color from "../Base/Color";

import Vector3 from "../Base/Vector3";
import { default as EntityManager, LocalPlayer } from "./EntityManager";

import Unit from "../Objects/Base/Unit";
import Hero from "../Objects/Base/Hero";
import Entity from "../Objects/Base/Entity";
import Modifier from "../Objects/Base/Modifier";

import ExecuteOrder from "../Native/ExecuteOrder";
import UserCmd from "../Native/UserCmd";

const EventsSDK: EventsSDK = new EventEmitter();

export default EventsSDK;

Events.on("onGameStarted", ent => EventsSDK.emit("onGameStarted", false, EntityManager.GetEntityByNative(ent)));

Events.on("onGameEnded", () => EventsSDK.emit("onGameEnded"));

Events.on("onWndProc", (...args) => EventsSDK.emit("onWndProc", true, ...args));

setInterval(() => {
	try {
		if (LocalPlayer !== undefined)
			EventsSDK.emit("onTick")
	} catch (e) {
		throw e
	}
}, Math.max(1000 / 30, GetLatency(Flow_t.IN)));

Events.on("onUpdate", cmd => EventsSDK.emit("onUpdate", false, new UserCmd(cmd)));

Events.on("onUnitStateChanged", npc => {
	if (LocalPlayer === undefined)
		return;
	
	EventsSDK.emit("onUnitStateChanged", false, EntityManager.GetEntityByNative(npc, true))
});

Events.on("onTeamVisibilityChanged", (npc, newTagged) => {
	if (LocalPlayer === undefined)
		return;
	
	const unit = EntityManager.GetEntityByNative(npc, true) as Unit;

	const isVisibleForEnemies = Unit.IsVisibleForEnemies(unit, newTagged);
	unit.IsVisibleForEnemies = isVisibleForEnemies;
	
	EventsSDK.emit("onTeamVisibilityChanged", false, unit, isVisibleForEnemies, newTagged)
});

Events.on("onDraw", () => EventsSDK.emit("onDraw"));

Events.on("onParticleCreated", (id, path, particleSystemHandle, attach, target) => 
	EventsSDK.emit("onParticleCreated", false, id, path, particleSystemHandle, attach, 
		target instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(target)
			: EntityManager.EntityByIndex(target)));

Events.on("onParticleUpdated", (id, control_point) =>
	EventsSDK.emit("onParticleUpdated", false, id, control_point, Vector3.fromIOBuffer()))

Events.on("onParticleUpdatedEnt", (id, control_point, ent, attach, attachment, include_wearables) => 
	EventsSDK.emit("onParticleUpdatedEnt", false, id, control_point,
		ent instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(ent)
			: EntityManager.EntityByIndex(ent),
		attach, attachment, Vector3.fromIOBuffer(), include_wearables));

Events.on("onBloodImpact", (target, scale, xnormal, ynormal) => 
	EventsSDK.emit("onBloodImpact", false,
		target instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(target)
			: EntityManager.EntityByIndex(target),
		scale, xnormal, ynormal));

Events.on("onPrepareUnitOrders", order => {
	const ordersSDK = ExecuteOrder.fromNative(order);
	
	if (ordersSDK === undefined)
		return true;
	
	return EventsSDK.emit("onPrepareUnitOrders", true, ordersSDK);
})

Events.on("onLinearProjectileCreated", (proj, ent, path, particleSystemHandle, max_speed, fow_radius, sticky_fow_reveal, distance) => {
	EventsSDK.emit("onLinearProjectileCreated", false, proj, 
		ent instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(ent)
			: EntityManager.EntityByIndex(ent), 
		path, particleSystemHandle, max_speed, fow_radius, sticky_fow_reveal, distance, Color.fromIOBuffer())
});

Events.on("onLinearProjectileDestroyed", proj =>
	EventsSDK.emit("onLinearProjectileDestroyed", false, proj))

Events.on("onTrackingProjectileCreated", (proj, sourceAttachment, path, particleSystemHandle, maximpacttime, launch_tick) =>
	EventsSDK.emit("onTrackingProjectileCreated", false, proj, sourceAttachment, path, particleSystemHandle, maximpacttime, Color.fromIOBuffer(), launch_tick))

Events.on("onTrackingProjectileUpdated", (proj, path, particleSystemHandle, launch_tick) =>
	EventsSDK.emit("onTrackingProjectileUpdated", false, Vector3.fromIOBuffer(), proj, path, particleSystemHandle, Color.fromIOBuffer(), launch_tick))

Events.on("onTrackingProjectileDestroyed", proj =>
	EventsSDK.emit("onTrackingProjectileDestroyed", false, proj))

Events.on("onUnitAnimation", (npc, sequenceVariant, playbackrate, castpoint, type, activity) =>
	EventsSDK.emit("onUnitAnimation", false, EntityManager.GetEntityByNative(npc), sequenceVariant, playbackrate, castpoint, type, activity))

Events.on("onUnitAnimationEnd", (npc, snap) =>
	EventsSDK.emit("onUnitAnimationEnd", false, EntityManager.GetEntityByNative(npc), snap))

Events.on("onCustomGameEvent", (...args) =>
	EventsSDK.emit("onCustomGameEvent", false, ...args));


interface EventsSDK extends EventEmitter {
	/**
	 * Emitted when local hero and local player are available
	 * 
	 * Also, emitted when scripts reloading
	 */
	on(name: "onGameStarted", callback: (localHero: Hero) => void): EventEmitter
	/**
	 * Emitted when game ended
	 * 
	 * Also, emitted when scripts reloading
	 */
	on(name: "onGameEnded", callback: () => void): EventEmitter
	/**
	 * Emitted local player choose team. Now LocalPlayer is available and valid
	 */
	on(name: "onLocalPlayerTeamAssigned", callback: (teamNum: DOTATeam_t) => void): EventEmitter
	/**
	 * Emitted about ALL entities that have may be in "Staging" and Is NOT Valid flag (NPC and childs, PhysicalItems and etc.)
	 * 
	 * Also, this event emitted about ALL entities that have already been created before reloading scripts
	 * 
	 * Emitted ONLY after LocalPlayer choose team (event: onLocalPlayerTeamAssigned)
	 * 
	 * CAREFUL !Use this if you know what you are doing!
	 */
	on(name: "onEntityPreCreated", callback: (ent: Entity, index: number) => void): EventEmitter
	/**
	 * Emitted about ALL entities that have Valid flag. This callback is best suited for use.
	 * 
	 * Also, this event emitted about ALL entities that have already been created (and valids) before reloading scripts
	 * 
	 * Emitted ONLY after LocalPlayer choose team (event: onLocalPlayerTeamAssigned)
	 */
	on(name: "onEntityCreated", callback: (ent: Entity, index: number) => void): EventEmitter
	on(name: "onEntityDestroyed", callback: (ent: Entity, index: number) => void): EventEmitter
	/**
	 * Analog (w/o hwnd) - https://docs.microsoft.com/en-us/previous-versions/windows/desktop/legacy/ms633573(v%3Dvs.85)
	 * 
	 * messageType: https://www.autoitscript.com/autoit3/docs/appendix/WinMsgCodes.htm
	 */
	on(name: "onWndProc", callback: (messageType: number, wParam: bigint, lParam: bigint) => false | any): EventEmitter
	/**
	 * Every ~33ms. Emitted after LocalPlayer has been created
	 */
	on(name: "onTick", callback: () => void): EventEmitter
	on(name: "onUpdate", callback: (cmd: UserCmd) => void): EventEmitter
	on(name: "onUnitStateChanged", callback: (npc: Unit) => void): EventEmitter
	on(name: "onTeamVisibilityChanged", callback: (npc: Unit, isVisibleForEnemies: boolean, isVisibleForTeamMask: number) => void): EventEmitter
	on(name: "onTrueSightedChanged", callback: (npc: Unit, isTrueSighted: boolean) => void): EventEmitter
	on(name: "onHasScepterChanged", callback: (npc: Unit, hasScepter: boolean) => void): EventEmitter
	on(name: "onDraw", callback: () => void): EventEmitter
	on(name: "onParticleCreated", callback: (id: number, path: string, particleSystemHandle: bigint, attach: ParticleAttachment_t, target?: Entity) => void): EventEmitter
	on(name: "onParticleUpdated", callback: (id: number, controlPoint: number, position: Vector3) => void): EventEmitter
	on(name: "onParticleUpdatedEnt", callback: (
		id: number,
		controlPoint: number,
		ent: Entity,
		attach: ParticleAttachment_t,
		attachment: number,
		fallbackPosition: Vector3,
		includeWearables: boolean
	) => void): EventEmitter
	on(name: "onBloodImpact", callback: (target: Entity, scale: number, xnormal: number, ynormal: number) => void): EventEmitter
	on(name: "onPrepareUnitOrders", callback: (order: ExecuteOrder) => false | any): EventEmitter
	on(name: "onLinearProjectileCreated", callback: (
		proj: LinearProjectile,
		ent: Entity,
		path: string,
		particleSystemHandle: bigint,
		maxSpeed: number,
		fowRadius: number,
		stickyFowReveal: boolean,
		distance: number,
		colorgemcolor: Color
	) => void): EventEmitter
	on(name: "onLinearProjectileDestroyed", callback: (proj: LinearProjectile) => void): EventEmitter
	on(name: "onTrackingProjectileCreated", callback: (
		proj: TrackingProjectile,
		sourceAttachment: number,
		path: string,
		particleSystemHandle: bigint,
		maximpacttime: number,
		colorgemcolor: Color,
		launchTick: number
	) => void): EventEmitter
	on(name: "onTrackingProjectileUpdated", callback: (
		proj: TrackingProjectile,
		vSourceLoc: Vector3,
		path: string,
		particleSystemHandle: bigint,
		colorgemcolor: Color,
		launchTick: number
	) => void): EventEmitter
	on(name: "onTrackingProjectileDestroyed", callback: (proj: TrackingProjectile) => void): EventEmitter
	on(name: "onUnitAnimation", callback: (
		npc: Unit,
		sequenceVariant: number,
		playbackrate: number,
		castpoint: number,
		type: number,
		activity: number
	) => void): EventEmitter
	on(name: "onUnitAnimationEnd", callback: (
		npc: Unit,
		snap: boolean
	) => void): EventEmitter
	/**
	 *	Also, this event emitted about ALL buffs(modifiers) that have already been created (and valids) before reloading scripts
	 */
	on(name: "onBuffAdded", listener: (npc: Unit, buff: Modifier) => void): EventEmitter
	on(name: "onBuffRemoved", listener: (npc: Unit, buff: Modifier) => void): EventEmitter
	on(name: "onBuffStackCountChanged", listener: (buff: Modifier) => void): EventEmitter
	on(name: "onCustomGameEvent", listener: (event_name: string, obj: any) => void): EventEmitter
	//on(name: "onNetworkFieldChanged", listener: (object: any, name: string) => void): EventEmitter
}