import { Vector3 } from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Entity } from "./Entity"

@WrapperClass("CDOTACameraBounds")
export class CCameraBounds extends Entity {
	@NetworkedBasicField("m_vecBoundsMin")
	public readonly BoundsMin = new Vector3()
	@NetworkedBasicField("m_vecBoundsMax")
	public readonly BoundsMax = new Vector3()
}

export let CameraBounds: Nullable<CCameraBounds>
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof CCameraBounds) {
		CameraBounds = ent
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (CameraBounds === ent) {
		CameraBounds = undefined
	}
})
