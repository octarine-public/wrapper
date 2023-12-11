import { Color } from "../../Base/Color"
import { Vector3 } from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { RenderMode } from "../../Enums/RenderMode"
import { Entity } from "./Entity"

@WrapperClass("CDOTA_RoshanSpawner")
export class RoshanSpawner extends Entity {
	@NetworkedBasicField("m_iKillCount")
	public readonly KillCount = 0
	@NetworkedBasicField("m_vRoshanAltLocation")
	public readonly AltLocation = new Vector3().Invalidate()

	public set CustomGlowColor(_: Nullable<Color>) {
		// N/A for non-networked entities
	}
	public set CustomDrawColor(_: Nullable<[Color, RenderMode]>) {
		// N/A for non-networked entities
	}
}
