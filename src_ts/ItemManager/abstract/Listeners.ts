import { EventsSDK, Entity } from "wrapper/Imports"
import * as AutoDeward from "../module/AutoDeward/Helper"
import * as AutoGlyph from "../module/AutoGlyph/Helper"
import * as AutoItems from "../module/AutoItems/Helper"

//import * as Shrine from "../module/Shrine/Helper"

EventsSDK.on("EntityCreated", ent => {
	//Shrine.EntityCreate(ent)
	AutoGlyph.EntityCreate(ent)
	AutoItems.EntityCreate(ent)
	AutoDeward.EntityCreate(ent)
})

EventsSDK.on("EntityDestroyed", ent => {
	AutoGlyph.EntityDestroy(ent)
	AutoItems.EntityDestroy(ent)
})
EventsSDK.on("PrepareUnitOrders", args => {
	AutoItems.UseMoseItemTarget(args)
	if (!AutoItems.OnExecuteOrderSoulRing(args)) {
		return false
	}
	return true
})
EventsSDK.on("ParticleCreated", (id, path, handle, attach, entity) => {
	AutoItems.ParticleCreate(id, handle, entity instanceof Entity ? entity : undefined)
})
EventsSDK.on("ParticleUpdated", AutoItems.ParticleCreateUpdate)
