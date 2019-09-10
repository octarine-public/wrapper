import { EventsSDK } from "wrapper/Imports"
import * as AutoDeward from "../module/AutoDeward/Helper"
// import * as Shrine from "../module/Shrine/Helper"
import * as AutoItems from "../module/AutoItems/Helper"
import { StateBase } from "./MenuBase"

EventsSDK.on("EntityCreated", (ent, index) => {
	if (!StateBase.value || ent === undefined || index === undefined)
		return
	// Shrine.EntityCreate(ent)
	AutoItems.EntityCreate(ent)
	AutoDeward.EntityCreate(ent)
})

EventsSDK.on("EntityDestroyed", (ent, index) => {
	if (!StateBase.value || ent === undefined || index === undefined)
		return
	AutoItems.EntityCreateDestroy(ent)
})
