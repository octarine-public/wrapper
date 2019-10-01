import { EventsSDK, Game, Entity } from "wrapper/Imports"
import * as AutoDeward from "../module/AutoDeward/Helper"
import * as AutoItems from "../module/AutoItems/Helper"

EventsSDK.on("EntityCreated", (ent, index) => {
	if (!Game.IsInGame || Game.IsPaused)
		return false
	// Shrine.EntityCreate(ent)
	AutoItems.EntityCreate(ent)
	AutoDeward.EntityCreate(ent)
})
EventsSDK.on("EntityDestroyed", AutoItems.EntityDestroy)
EventsSDK.on("ParticleCreated", (id, path, handle, attach, entity) => {
	AutoItems.ParticleCreate(id, handle, entity instanceof Entity ? entity : undefined)
})
EventsSDK.on("ParticleUpdated", AutoItems.ParticleCreateUpdate)
