import { Vector3, MenuManager, EventsSDK, PlayerResource, EntityManager, LocalPlayer, Hero } from "./CrutchesSDK/Imports";

let { MenuFactory } = MenuManager;

let setConVar = (value: number | string | boolean, menuBase: Menu_Base) =>
	ConVars.Set(menuBase.hint, value)

let debuggerMenu = MenuFactory("Debugger")

let sv_cheatsMenu = debuggerMenu.AddTree("sv_cheats tree")

let sv_cheats = sv_cheatsMenu.AddToggle("sv_cheats")
	.SetToolTip("sv_cheats")
	.OnValue(setConVar)

let wtf = sv_cheatsMenu.AddToggle("wtf")
	.SetToolTip("dota_ability_debug")
	.OnValue(setConVar)

let vision = sv_cheatsMenu.AddToggle("all vision")
	.SetToolTip("dota_all_vision")
	.OnValue(setConVar)

let creepsNoSpawn = sv_cheatsMenu.AddToggle("Creeps no spawning")
	.SetToolTip("dota_creeps_no_spawning")
	.OnValue(setConVar)

let refresh = sv_cheatsMenu.AddKeybind("Refresh")
	.SetToolTip("dota_hero_refresh")
	.OnRelease(self => SendToConsole(self.hint))

let localLvl = sv_cheatsMenu.AddKeybind("Local lvl max")
	.SetToolTip("dota_hero_level 25")
	.OnRelease(self => SendToConsole(self.hint))

let getRapGod = sv_cheatsMenu.AddKeybind("Get Rap God")
	.SetToolTip("dota_rap_god")
	.OnRelease(self => SendToConsole(self.hint))

let addUnitMenu = debuggerMenu.AddTree("add unit")

addUnitMenu.AddKeybind("Add full Sven")
	.OnRelease(() => {
		SendToConsole("dota_create_unit npc_dota_hero_sven enemy")

		setTimeout(() => {
			for (var i = 6; i--; )
				SendToConsole("dota_bot_give_item item_heart")

			SendToConsole("dota_bot_give_level 25")
		}, 1000)
	})

addUnitMenu.AddKeybind("Add creep")
	.SetToolTip("dota_create_unit npc_dota_creep_badguys_melee enemy")
	.OnRelease(self => SendToConsole(self.hint))

EventsSDK.on("onGameStarted", lp => {

	setConVar(sv_cheats.value, sv_cheats)
	setConVar(wtf.value, wtf)

	if (PlayerResource.AllPlayers.length <= 1)
		setConVar(vision.value, vision)

	setConVar(creepsNoSpawn.value, creepsNoSpawn);
})

// ======================= DEBUGGING EVENTS

const debugEventsMenu = debuggerMenu.AddTree("Debugging events", "Debugging native events in console");

const debugEvents = debugEventsMenu.AddToggle("Debugging events");
const debugOnlyThrowEvents = debugEventsMenu.AddToggle("Debugging only throw", true);

const debugDrawEvents = debugEventsMenu.AddToggle("Debug Draw");

const debugEntitiesEvents = debugEventsMenu.AddToggle("Debug Entities");
const debugBuffsEvents = debugEventsMenu.AddToggle("Debug Buffs");

const debugOtherEvents = debugEventsMenu.AddToggle("Debug Other");

let allEvents: EventEmitter[] = [];

Events.on("onGameStarted", (pl_ent) => {
	if (!debugEvents.value || !debugOtherEvents.value) return;
	
	if (!debugOnlyThrowEvents.value) 
		console.log("onGameStarted", pl_ent);
		
	if (!(pl_ent instanceof C_DOTA_BaseNPC_Hero))
		throw Error("onGameStarted. pl_ent is not C_DOTA_BaseNPC_Hero:" + pl_ent)
});
Events.on("onGameEnded", () => {
	if (!debugEvents.value || !debugOtherEvents.value) return;
	
	if (!debugOnlyThrowEvents.value) 
		console.log("onGameEnded");
});
Events.on("onLocalPlayerTeamAssigned", teamNum => {
	if (!debugEvents.value || !debugOtherEvents.value) return;
	
	if (!debugOnlyThrowEvents.value) 
		console.log("onLocalPlayerTeamAssigned", teamNum);
})
Events.on("onEntityCreated", (ent, id) => {
	if (!debugEvents.value || !debugEntitiesEvents.value) return;
	
	if (!debugOnlyThrowEvents.value) 
		console.log("onEntityCreated", ent, id);
		
	if (ent instanceof TrackingProjectile || ent instanceof LinearProjectile)
		console.error(ent, "m_iID", ent.m_iID, "m_bIsValid", ent.m_bIsValid, Vector3.fromIOBuffer(ent.m_vecPosition));
		
	if (!(ent instanceof C_BaseEntity) || typeof id !== "number")
		throw Error("onEntityCreated. ent is not C_BaseEntity:" + ent + ", index: " + id)
});
Events.on("onEntityDestroyed", (ent, id) => {
	if (!debugEvents.value || !debugEntitiesEvents.value) return;
	
	if (!debugOnlyThrowEvents.value) 
		console.log("onEntityCreated", ent, id);
		
	if (ent instanceof TrackingProjectile || ent instanceof LinearProjectile)
		console.error(ent, "m_iID", ent.m_iID, "m_bIsValid", ent.m_bIsValid, Vector3.fromIOBuffer(ent.m_vecPosition));
		
	if (!(ent instanceof C_BaseEntity) || typeof id !== "number")
		throw Error("onEntityDestroyed. ent is not C_BaseEntity:" + ent + ", index: " + id)
});
Events.on("onWndProc", (...args) => {
	if (!debugEvents.value) return;
});
Events.on("onUpdate", cmd => {
	if (!debugEvents.value) return;
	
});
Events.on("onUnitStateChanged", npc => {
	if (!debugEvents.value || !debugOtherEvents.value) return;
	
	if (!debugOnlyThrowEvents.value) 
		console.log("onUnitStateChanged", npc);
		
	if (!(npc instanceof C_DOTA_BaseNPC))
		throw Error("onUnitStateChanged. npc is not C_DOTA_BaseNPC:" + npc)
});
Events.on("onTeamVisibilityChanged", (npc, newTagged) => {
	if (!debugEvents.value || !debugOtherEvents.value) return;
	
	if (!debugOnlyThrowEvents.value) 
		console.log("onTeamVisibilityChanged", npc, newTagged);
		
	if (!(npc instanceof C_DOTA_BaseNPC) || typeof newTagged !== "number")
		throw Error("onTeamVisibilityChanged. npc is not C_DOTA_BaseNPC:" + npc + ", newTagged" + newTagged);
});
Events.on("onDraw", () => {
	if (!debugEvents.value || !debugDrawEvents.value) return;
	
	if (!debugOnlyThrowEvents.value) 
		console.log("onDraw");
});
Events.on("onParticleCreated", (...args) => debugConsole("onParticleCreated", ...args));
Events.on("onParticleUpdated", (...args) => debugConsole("onParticleUpdated", ...args));
Events.on("onParticleUpdatedEnt", (...args) => debugConsole("onParticleUpdatedEnt", ...args));
Events.on("onBloodImpact", (...args) => debugConsole("onBloodImpact", ...args));
Events.on("onPrepareUnitOrders", order => {
	if (!debugEvents.value || !debugOtherEvents.value) return;
	
	if (!debugOnlyThrowEvents.value) 
		console.log("onPrepareUnitOrders", order);
		
	if (!(order instanceof CUnitOrder))
		throw Error("onPrepareUnitOrders. order is not CUnitOrder:" + order);
});
Events.on("onLinearProjectileCreated", (...args) => debugConsole("onLinearProjectileCreated", ...args));
Events.on("onLinearProjectileDestroyed", proj => debugConsole("onLinearProjectileDestroyed", proj, "m_iID", proj.m_iID, "m_bIsValid", proj.m_bIsValid, proj.m_vecPosition, Vector3.fromIOBuffer(proj.m_vecPosition)));
Events.on("onTrackingProjectileCreated", (...args) => debugConsole("onTrackingProjectileCreated", ...args));
Events.on("onTrackingProjectileUpdated", (...args) => debugConsole("onTrackingProjectileUpdated", ...args));
Events.on("onTrackingProjectileDestroyed", proj => debugConsole("onTrackingProjectileDestroyed", proj));
Events.on("onUnitAnimation", (...args) => debugConsole("onUnitAnimation", ...args));
Events.on("onUnitAnimationEnd", (...args) => debugConsole("onUnitAnimation", ...args));
Events.on("onBuffAdded", (npc, buff) => {
	if (!debugEvents.value || !debugBuffsEvents.value) return;
	
	if (!debugOnlyThrowEvents.value) 
		console.log("onBuffAdded", npc, buff);
	
	if (!(npc instanceof C_DOTA_BaseNPC))
		throw Error(name + ". npc is not C_DOTA_BaseNPC:" + npc)

	if (!(buff instanceof CDOTA_Buff))
		throw Error(name + ". npc is not CDOTA_Buff:" + buff)
});
Events.on("onBuffRemoved", (npc, buff) => {
	if (!debugEvents.value || !debugBuffsEvents.value) return;
	
	if (!debugOnlyThrowEvents.value) 
		console.log("onBuffRemoved", npc, buff);
	
	if (!(npc instanceof C_DOTA_BaseNPC))
		throw Error(name + ". npc is not C_DOTA_BaseNPC:" + npc)

	if (!(buff instanceof CDOTA_Buff))
		throw Error(name + ". npc is not CDOTA_Buff:" + buff)
});
Events.on("onBuffStackCountChanged", buff => {
	if (!debugEvents.value || !debugBuffsEvents.value) return;
	
	if (!debugOnlyThrowEvents.value) 
		console.log("onBuffStackCountChanged", buff);
	
	if (!(buff instanceof CDOTA_Buff))
		throw Error(name + ". npc is not CDOTA_Buff:" + buff)
});
Events.on("onCustomGameEvent", (...args) => debugConsole("onCustomGameEvent", ...args));

let debugConsole = (name: string, ...args: any) => 
	debugEvents.value && !debugOnlyThrowEvents.value && debugOtherEvents.value && console.log(name, ...args);
	
	
/* EventsSDK.on("onTick", () => {
	
	EntityManager.AllEntities.forEach(entity => {
		if (entity instanceof Hero && entity.IsControllable) {
			
			if (entity === undefined || !entity.IsAlive)
				return
				
			let high_five = entity.AbilitiesBook.GetAbilityByName("high_five")
			
			if (high_five === undefined || !high_five.IsCooldownReady)
				return
			console.log(high_five.Cooldown);
			entity.CastNoTarget(high_five)
		}
	})
}) */