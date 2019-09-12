import { Entity, EntityManager, EventsSDK, Game, Unit, Vector3} from "wrapper/Imports"
import * as Camp from "../Module/CampInformer/Entity"
import * as JungMapHack from "../Module/JungleMapHack/Particle"
import * as ParicleMapHack from "../Module/ParticleMapHack/Particle"
import * as Rosh from "../Module/Roshan/Particle"
import * as Techies from "../Module/TechiesMapHack/Particle"
import * as Treant from "../Module/TreantMapHack/Particle"
import * as Wisp from "../Module/WispMapHack/Particle"
import * as VBE from "../Module/VisibleByEnemy/Entities"
import * as VBS from "../Module/TrueSight/Entities"
import { stateMain } from "./Menu.Base"
// import * as TopHud from "../Module/TopHud/Entities"

export var NPC: Unit[] = []
EventsSDK.on("EntityCreated", (ent, index) => {
	if (!stateMain.value || ent === undefined || index === undefined)
		return
	VBS.EntityCreated(ent)
	VBE.EntityCreated(ent)
	Camp.onEntityAdded(ent)
	Treant.Create(ent, index)
	ParicleMapHack.EntityCreated(ent)
	// TopHud.entityCreate(ent)
})

EventsSDK.on("EntityDestroyed", (ent, index) => {
	if (!stateMain.value || ent === undefined || index === undefined)
		return
	VBS.EntityDestroyed(ent)
	VBE.EntityDestroyed(ent)
	Camp.EntityDestroyed(ent)
	Treant.Destroy(ent, index)
	// TopHud.entityDestroy(ent)
	ParicleMapHack.EntityDestroyed(ent)
})

EventsSDK.on("UnitAnimation", npc => {
	if (!stateMain.value || npc === undefined || Game.IsPaused)
		return
	JungMapHack.UnitAnimationCreate(npc)
})

EventsSDK.on("ParticleCreated", (id, path, handle, attach, entity) => {
	if (!stateMain.value || Game.IsPaused)
		return
	Rosh.ParticleCreate(handle)
	Wisp.ParticleCreate(id, handle)
	Techies.ParticleCreated(id, entity instanceof Entity ? entity : undefined, path)
	ParicleMapHack.ParticleCreate(id, handle, entity instanceof Entity ? entity : undefined)
})

EventsSDK.on("ParticleUpdated", (id, control_point, position) => {
	if (!stateMain.value || Game.IsPaused)
		return
	Techies.ParticleUpdated(id, control_point, position)
	ParicleMapHack.ParticleCreateUpdate(id, control_point, position)
})

EventsSDK.on("ParticleUpdatedEnt", (id, control_point, entity, attach, attachment, vector) => {
	if (!stateMain.value || Game.IsPaused)
		return
	Techies.ParticleUpdatedEnt(id, control_point, attach, vector)
	Wisp.ParticleUpdated(id, entity instanceof Entity ? entity.m_pBaseEntity : undefined)
	ParicleMapHack.ParticleUpdatedEnt(id, entity instanceof Entity ? entity : undefined, vector)
})

EventsSDK.on("ParticleDestroyed", id => {
	Techies.ParticleDestroyed(id)
	ParicleMapHack.ParticleDestroyed(id)
})

EventsSDK.on("TeamVisibilityChanged", (npc, isVisibleForEnemies) => {
	if (!stateMain.value)
		return
	VBE.TeamVisibilityChanged(npc, isVisibleForEnemies)
})
EventsSDK.on("TrueSightedChanged", (npc, isTrueSighted) => {
	VBS.TrueSightedChanged(npc, isTrueSighted)
})

