import { Entity, EventsSDK, Unit, Vector3, Game} from "wrapper/Imports"

import { stateMain } from "./Menu.Base"
import * as Rosh from "../Module/Roshan/Particle"
import { State } from "../Module/TreantMapHack/Menu"
import * as Wisp from "../Module/WispMapHack/Particle"
import * as Treant from "../Module/TreantMapHack/Particle"
import * as Techies from "../Module/TechiesMapHack/Particle"
import * as JungMapHack from "../Module/JungleMapHack/Particle"
import * as ParicleMapHack from "../Module/ParticleMapHack/Particle"

// import * as TopHud from "../Module/TopHud/Entities"
export var NPC: Unit[] = []
EventsSDK.on("EntityCreated", (ent: Entity, index: number) => {
	if (!stateMain.value || ent === undefined || index === undefined)
		return
	if (State.value){
		Treant.Create(ent, index)
	}
	//TopHud.entityCreate(ent)
})
EventsSDK.on("EntityDestroyed", (ent: Entity, index: number) => {
	if (!stateMain.value || ent === undefined || index === undefined)
		return
	if (State.value){
		Treant.Destroy(ent, index)
	}
	//TopHud.entityDestroy(ent)
})
EventsSDK.on("UnitAnimation", (npc: Unit, sequenceVariant?: number, playbackrate?: number, castpoint?: number, type?: number, activity?: number) => {
	if (!stateMain.value || npc === undefined || Game.IsPaused)
		return;
	JungMapHack.UnitAnimationCreate(npc);
})
EventsSDK.on("ParticleCreated", (id: number, path: string, handle: bigint, attach: number, entity: Entity) => {
	if (!stateMain.value || Game.IsPaused)
		return;
	Rosh.ParticleCreate(handle)
	Wisp.ParticleCreate(id, handle)
	Techies.ParticleCreated(id, entity, path)
	ParicleMapHack.ParticleCreate(id, handle, entity)
});
EventsSDK.on("ParticleUpdated", (id: number, control_point: number, position: Vector3) => {
	if (!stateMain.value || Game.IsPaused)
		return;
	Techies.ParticleUpdated(id, control_point, position)
	ParicleMapHack.ParticleCreateUpdate(id, control_point, position)
})

EventsSDK.on("ParticleUpdatedEnt", (id: number, control_point: number, entity: Entity, attach: ParticleAttachment_t, attachment: number, vector: Vector3) => {
	if (!stateMain.value || Game.IsPaused)
		return;
	Techies.ParticleUpdatedEnt(id, control_point, attach, vector)
	Wisp.ParticleUpdated(id, entity.m_pBaseEntity as C_BaseEntity)
	ParicleMapHack.ParticleUpdatedEnt(id, entity, vector)
})

