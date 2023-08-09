import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { Building } from "./Building"

@WrapperClass("CDOTA_NPC_Lantern")
export class Lantern extends Building {
	public ForwardNativeProperties(
		healthBarOffset: number,
		moveCapabilities: number,
		absPosition: Vector3
	) {
		super.ForwardNativeProperties(
			healthBarOffset,
			moveCapabilities,
			absPosition
		)

		this.VisualPosition.CopyFrom(absPosition)
		this.NetworkedPosition.CopyFrom(absPosition)
	}
}
