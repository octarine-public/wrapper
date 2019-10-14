import { Entity, EventsSDK, Game} from "wrapper/Imports"
import * as Camp from "../Module/CampInformer/Entity"
import * as JungMapHack from "../Module/JungleMapHack/Particle"
import * as ParicleMapHack from "../Module/ParticleMapHack/Particle"
import * as Rosh from "../Module/Roshan/Particle"
import * as Techies from "../Module/TechiesMapHack/Particle"
import * as Treant from "../Module/TreantMapHack/Particle"
import * as VBS from "../Module/TrueSight/Entities"
import * as VBE from "../Module/VisibleByEnemy/Entities"
import * as Wisp from "../Module/WispMapHack/Particle"
import * as TowerRange from "../Module/TowerRange/Particle"
import { stateMain } from "./Menu.Base"
// import * as TopHud from "../Module/TopHud/Entities"


EventsSDK.on("UnitAnimation", npc => {
	if (!stateMain.value || npc === undefined)
		return
	Rosh.UnitAnimationCreate(npc)
	JungMapHack.UnitAnimationCreate(npc)
})
EventsSDK.on("LifeStateChanged", ent => {
	if (!stateMain.value)
		return
	Techies.LifeStateChanged(ent)
	VBE.LifeStateChanged(ent)
	VBS.LifeStateChanged(ent)
})
EventsSDK.on("ParticleDestroyed", id => {
	Techies.ParticleDestroyed(id)
	ParicleMapHack.ParticleDestroyed(id)
})
EventsSDK.on("TrueSightedChanged", npc => {
	VBS.TrueSightedChanged(npc)
})
EventsSDK.on("TeamVisibilityChanged", npc => {
	if (!stateMain.value || Game.IsPaused)
		return
	VBE.TeamVisibilityChanged(npc)
})
EventsSDK.on("EntityCreated", (ent, index) => {
	Camp.onEntityAdded(ent)
	Treant.Create(ent, index)
	TowerRange.Create(ent)
	ParicleMapHack.EntityCreated(ent)
	// TopHud.entityCreate(ent)
})
EventsSDK.on("EntityDestroyed", (ent, index) => {
	VBS.EntityDestroyed(ent)
	VBE.EntityDestroyed(ent)
	Camp.EntityDestroyed(ent)
	Treant.Destroy(ent, index)
	TowerRange.Destroy(ent)
	// TopHud.entityDestroy(ent)
	ParicleMapHack.EntityDestroyed(ent)
	Techies.EntityDestroyed(ent)
})
EventsSDK.on("ParticleUpdated", (id, control_point, position) => {
	if (!stateMain.value)
		return
	Techies.ParticleUpdated(id, control_point, position)
	ParicleMapHack.ParticleCreateUpdate(id, control_point, position)
})
EventsSDK.on("ParticleCreated", (id, path, handle, attach, entity) => {
	if (!stateMain.value)
		return
	Rosh.ParticleCreate(handle)
	Wisp.ParticleCreate(id, handle)
	Techies.ParticleCreated(id, entity instanceof Entity ? entity : undefined, path)
	ParicleMapHack.ParticleCreate(id, handle, path, entity instanceof Entity ? entity : undefined)
})
EventsSDK.on("ParticleUpdatedEnt", (id, control_point, entity, attach, attachment, vector) => {
	if (!stateMain.value)
		return
	Techies.ParticleUpdatedEnt(id, control_point, attach, vector)
	Wisp.ParticleUpdated(id, entity instanceof Entity ? entity.m_pBaseEntity : undefined)
	ParicleMapHack.ParticleUpdatedEnt(id, entity instanceof Entity ? entity : undefined, vector)
})