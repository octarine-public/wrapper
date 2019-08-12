import { EventsSDK } from "wrapper/Imports";
import { StateBase } from "./MenuBase"
//import * as Shrine from "../module/Shrine/Helper"
import * as Autotems from "../module/Autotems/Helper"

EventsSDK.on("EntityCreated", (ent, index) => {
	if (!StateBase.value || ent === undefined || index === undefined)
		return;
	//Shrine.EntityCreate(ent)
	Autotems.EntityCreate(ent)
})

EventsSDK.on("EntityDestroyed", (ent, index) => {
	if (!StateBase.value || ent === undefined || index === undefined)
		return
})