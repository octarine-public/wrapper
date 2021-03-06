import Vector3 from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import EventsSDK from "../../Managers/EventsSDK"
import Entity from "./Entity"

@WrapperClass("CDOTACameraBounds")
export default class CCameraBounds extends Entity {
	@NetworkedBasicField("m_vecBoundsMin")
	public BoundsMin = new Vector3()
	@NetworkedBasicField("m_vecBoundsMax")
	public BoundsMax = new Vector3()
}

export let CameraBounds: Nullable<CCameraBounds>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof CCameraBounds)
		CameraBounds = ent
})

EventsSDK.on("EntityDestroyed", ent => {
	if (CameraBounds === ent)
		CameraBounds = undefined
})
