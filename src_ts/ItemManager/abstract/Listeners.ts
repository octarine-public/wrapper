import { EventsSDK, Unit, Vector3 } from "wrapper/Imports"
import InitItems from "./Items"
import { StateBase } from "./MenuBase"
import * as AutoItems from "../module/AutoItems/Helper"

//import * as Shrine from "../module/Shrine/Helper"
export const initItemsMap = new Map<Unit, InitItems>()
export let glimer: Map<Vector3, InitItems> = new Map()
export let ParticleGlimer: Map<number, Vector3> = new Map()

export function GlimerClear() {
	ParticleGlimer.clear()
	glimer.clear()
}

export function MapClear() {
	glimer.clear()
	initItemsMap.clear()
	ParticleGlimer.clear()
}

EventsSDK.on("PrepareUnitOrders", args => {
	if (!StateBase.value)
		return true
	AutoItems.UseMouseItemTarget(args)
	if (!AutoItems.OnExecuteOrder(args))
		return false
	return true
})

EventsSDK.on("ParticleCreated", (id, path, handle, attach, entity) => {
	if (handle === 1954660700683781942n)
		ParticleGlimer.set(id, new Vector3)
})

EventsSDK.on("ParticleUpdated", (id, controlPoint, position) => {
	let part = ParticleGlimer.get(id)
	if (part !== undefined)
		ParticleGlimer.set(id, position)
})
