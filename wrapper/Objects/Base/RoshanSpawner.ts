import { Vector3 } from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { Entity } from "./Entity"

@WrapperClass("CDOTA_RoshanSpawner")
export class RoshanSpawner extends Entity {
	@NetworkedBasicField("m_iKillCount")
	public readonly KillCount = 0
	@NetworkedBasicField("m_vRoshanAltLocation")
	public readonly AltLocation = new Vector3().Invalidate()
}
