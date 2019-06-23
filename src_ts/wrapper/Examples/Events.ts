import { EventsSDK, Vector3, Hero, Entity, Unit } from "../Imports"

import { Menu } from "./Examples";

const EventsDebuging = Menu.AddTree("EventsSDK Debugging", "Debugging SDK events in console")

const debugEvents = EventsDebuging.AddToggle("Debugging events");

const debugOnlyThrowEvents = EventsDebuging.AddToggle("Debugging only throw", true);

const debugEntitiesEvents = EventsDebuging.AddToggle("Debug Entities");
const debugBuffsEvents = EventsDebuging.AddToggle("Debug Buffs");

const debugDrawEvents = EventsDebuging.AddToggle("Debug Draw");
const debugOnUpdateEvents = EventsDebuging.AddToggle("Debug OnUpdate");
const debugExecuteOrderEvents = EventsDebuging.AddToggle("Debug ExecuteOrder");

const debugOtherEvents = EventsDebuging.AddToggle("Debug Other");

EventsSDK.on("onGameStarted", (localHero) => {
	if (!debugEvents.value || !debugOtherEvents.value) return;

	if (!debugOnlyThrowEvents.value)
		console.log("onGameStarted", localHero);

	if (!(localHero instanceof Hero))
		throw Error("onGameStarted. localHero is not Hero:" + localHero)
});
EventsSDK.on("onGameEnded", () => {
	if (!debugEvents.value || !debugOtherEvents.value) return;

	if (!debugOnlyThrowEvents.value)
		console.log("onGameEnded");
});
EventsSDK.on("onLocalPlayerTeamAssigned", teamNum => {
	if (!debugEvents.value || !debugOtherEvents.value) return;

	if (!debugOnlyThrowEvents.value)
		console.log("onLocalPlayerTeamAssigned", teamNum);
})
EventsSDK.on("onEntityCreated", (ent, id) => {
	if (!debugEvents.value || !debugEntitiesEvents.value) return;

	if (!debugOnlyThrowEvents.value)
		console.log("onEntityCreated", ent, id);

	if (!(ent instanceof Entity) || typeof id !== "number")
		throw Error("onEntityCreated. ent is not Entity:" + ent + ", index: " + id)
});
EventsSDK.on("onEntityDestroyed", (ent, id) => {
	if (!debugEvents.value || !debugEntitiesEvents.value) return;

	if (!debugOnlyThrowEvents.value)
		console.log("onEntityCreated", ent, id);

	if (!(ent instanceof Entity) || typeof id !== "number")
		throw Error("onEntityDestroyed. ent is not Entity:" + ent + ", index: " + id)
});
EventsSDK.on("onWndProc", (...args) => {
	if (!debugEvents.value) return;
});
EventsSDK.on("onUpdate", cmd => {
	if (!debugEvents.value || !debugOnUpdateEvents.value) return;
	
	//console.log("onUpdate", cmd);
	//setTimeout(() => console.clear(), 25);
});
EventsSDK.on("onUnitStateChanged", npc => {
	if (!debugEvents.value || !debugOtherEvents.value) return;

	if (!debugOnlyThrowEvents.value)
		console.log("onUnitStateChanged", npc);

	if (!(npc instanceof Unit))
		throw Error("onUnitStateChanged. npc is not Unit:" + npc)
});
EventsSDK.on("onTeamVisibilityChanged", (npc, newTagged) => {
	if (!debugEvents.value || !debugOtherEvents.value) return;

	if (!debugOnlyThrowEvents.value)
		console.log("onTeamVisibilityChanged", npc, newTagged);

	if (!(npc instanceof Unit) || typeof newTagged !== "number")
		throw Error("onTeamVisibilityChanged. npc is not Unit:" + npc + ", newTagged" + newTagged);
});
EventsSDK.on("onDraw", () => {
	if (!debugEvents.value || !debugDrawEvents.value) return;

	console.log("onDraw");
});
EventsSDK.on("onParticleCreated", (...args) => debugConsole("onParticleCreated", ...args));
EventsSDK.on("onParticleUpdated", (...args) => debugConsole("onParticleUpdated", ...args));
EventsSDK.on("onParticleUpdatedEnt", (...args) => debugConsole("onParticleUpdatedEnt", ...args));
EventsSDK.on("onBloodImpact", (...args) => debugConsole("onBloodImpact", ...args));
EventsSDK.on("onPrepareUnitOrders", order => {
	if (!debugEvents.value || !debugExecuteOrderEvents.value) return;

	console.log("onPrepareUnitOrders", order);
});
EventsSDK.on("onLinearProjectileCreated", (...args) => debugConsole("onLinearProjectileCreated", ...args));
EventsSDK.on("onLinearProjectileDestroyed", proj => debugConsole("onLinearProjectileDestroyed", proj, "m_iID", proj.m_iID, "m_bIsValid", proj.m_bIsValid, proj.m_vecPosition, Vector3.fromIOBuffer(proj.m_vecPosition)));
EventsSDK.on("onTrackingProjectileCreated", (...args) => debugConsole("onTrackingProjectileCreated", ...args));
EventsSDK.on("onTrackingProjectileUpdated", (...args) => debugConsole("onTrackingProjectileUpdated", ...args));
EventsSDK.on("onTrackingProjectileDestroyed", proj => debugConsole("onTrackingProjectileDestroyed", proj));
EventsSDK.on("onUnitAnimation", (...args) => debugConsole("onUnitAnimation", ...args));
EventsSDK.on("onUnitAnimationEnd", (...args) => debugConsole("onUnitAnimation", ...args));
EventsSDK.on("onBuffAdded", (npc, buff) => {
	if (!debugEvents.value || !debugBuffsEvents.value) return;

	if (!debugOnlyThrowEvents.value)
		console.log("onBuffAdded", npc, buff);

	if (!(npc instanceof Unit))
		throw Error(name + ". npc is not Unit:" + npc)

	if (!(buff instanceof CDOTA_Buff))
		throw Error(name + ". npc is not CDOTA_Buff:" + buff)
});
EventsSDK.on("onBuffRemoved", (npc, buff) => {
	if (!debugEvents.value || !debugBuffsEvents.value) return;

	if (!debugOnlyThrowEvents.value)
		console.log("onBuffRemoved", npc, buff);

	if (!(npc instanceof Unit))
		throw Error(name + ". npc is not Unit:" + npc)

	if (!(buff instanceof CDOTA_Buff))
		throw Error(name + ". npc is not CDOTA_Buff:" + buff)
});
EventsSDK.on("onBuffStackCountChanged", buff => {
	if (!debugEvents.value || !debugBuffsEvents.value) return;

	if (!debugOnlyThrowEvents.value)
		console.log("onBuffStackCountChanged", buff);

	if (!(buff instanceof CDOTA_Buff))
		throw Error(name + ". npc is not CDOTA_Buff:" + buff)
});
EventsSDK.on("onCustomGameEvent", (...args) => debugConsole("onCustomGameEvent", ...args));

let debugConsole = (name: string, ...args: any) =>
	debugEvents.value && !debugOnlyThrowEvents.value && debugOtherEvents.value && console.log(name, ...args);