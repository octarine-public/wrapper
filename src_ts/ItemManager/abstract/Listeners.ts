import { EventsSDK, Game } from "wrapper/Imports"
import * as AutoDeward from "../module/AutoDeward/Helper"
import * as AutoItems from "../module/AutoItems/Helper"

EventsSDK.on("EntityCreated", (ent, index) => {
	if (!Game.IsInGame || Game.IsPaused)
		return false
	// Shrine.EntityCreate(ent)
	AutoItems.EntityCreate(ent)
	AutoDeward.EntityCreate(ent)
})

EventsSDK.on("EntityDestroyed", (ent, index) => {
	AutoItems.EntityCreateDestroy(ent)
})
