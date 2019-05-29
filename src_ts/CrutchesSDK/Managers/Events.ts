import QAngle from "../Base/QAngle";
import Color from "../Base/Color";

import Vector3 from "../Base/Vector3";
import { default as EntityManager, LocalPlayer } from "./EntityManager";

import Unit from "../Objects/Base/Unit";
//import Hero from "../Objects/Base/Hero";
/* import Entity from "../Objects/Base/Entity";
import Ability from "../Objects/Base/Ability";
import Unit from "../Objects/Base/Unit";
 */
import ExecuteOrder from "../Native/ExecuteOrder";

const EventsSDK: EventsSDK = new EventEmitter();

export default EventsSDK;

Events.on("onGameStarted", ent => {

	const entity = EntityManager.GetEntityByNative(ent)// as Hero;

	EventsSDK.emit("onGameStarted", false, entity);
})

Events.on("onGameEnded", () => EventsSDK.emit("onGameEnded"));
Events.on("onWndProc", (...args) => EventsSDK.emit("onWndProc", true, ...args));


(function onTick() {
	setTimeout(() => {
		try {
			if (LocalPlayer !== undefined)
				EventsSDK.emit("onTick")
		} catch (e) {
			throw e
		} finally {
			onTick();
		}
	}, Math.max(1000 / 30, GetLatency(Flow_t.IN)))
})();

// change later
Events.on("onUpdate", cmd => {
	
	/* let cmdCustom = Object.assign({
		vec_under_cursor: Vector3.fromIOBuffer(cmd.vec_under_cursor),
		viewangles: QAngle.fromIOBuffer(cmd.viewangles)
	}, cmd) */
	
	EventsSDK.emit("onUpdate", false, cmd);
	
	/* cmd.viewangles = cmdCustom.viewangles.toIOBuffer()
	cmd.vec_under_cursor = cmdCustom.vec_under_cursor.toIOBuffer() */
});

Events.on("onUnitStateChanged", npc => {

	const entity = EntityManager.GetEntityByNative(npc, true) as Unit;

	EventsSDK.emit("onUnitStateChanged", false, entity)
});


Events.on("onTeamVisibilityChanged", (npc, newTagged) => {

	const entity = EntityManager.GetEntityByNative(npc, true) as Unit;

	entity.IsVisibleForTeamMask = newTagged;
	entity.IsVisibleForEnemies = Unit.IsVisibleForEnemies(entity, newTagged);

	EventsSDK.emit("onTeamVisibilityChanged", false, entity, newTagged)
});


Events.on("onDraw", () => EventsSDK.emit("onDraw"));
//Events.on("onParticleCreated", (...args) => console.log("onParticleCreated SDK", ...args));
Events.on("onParticleCreated", (id, path, particleSystemHandle, attach, target) => {
	
	EventsSDK.emit("onParticleCreated", false, id, path, particleSystemHandle, attach, 
		target instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(target)
			: EntityManager.EntityByIndex(target));
});

Events.on("onParticleUpdated", (id, control_point) =>
	EventsSDK.emit("onParticleUpdated", false, id, control_point, Vector3.fromIOBuffer()))

Events.on("onParticleUpdatedEnt", (id, control_point, ent, attach, attachment, include_wearables) => {
	
	EventsSDK.emit("onParticleUpdatedEnt", false, id, control_point, 
		ent instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(ent)
			: EntityManager.EntityByIndex(ent),
		attach, attachment, Vector3.fromIOBuffer(), include_wearables)
});

Events.on("onBloodImpact", (target, scale, xnormal, ynormal) => {
	
	EventsSDK.emit("onBloodImpact", false,
		target instanceof C_BaseEntity
			? EntityManager.GetEntityByNative(target)
			: EntityManager.EntityByIndex(target),
		scale, xnormal, ynormal);
});

Events.on("onPrepareUnitOrders", order => {
	/* console.log("PrepareUnitOrders",
		order.order_type,
		order.target,
		order.position,
		order.ability,
		order.issuer,
		order.unit,
		order.queue,
		order.show_effects
	) */
	
	let ordersSDK = ExecuteOrder.fromNative(order);
	
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

Events.on("onCustomGameEvent", (event_name, obj) =>
	EventsSDK.emit("onCustomGameEvent", false, event_name, obj));