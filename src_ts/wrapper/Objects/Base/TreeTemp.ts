import Entity from "./Entity"
import Vector3 from "../../Base/Vector3"
import { WrapperClass, NetworkedBasicField } from "../../Decorators"

@WrapperClass("C_DOTA_TempTree")
export default class TempTree extends Entity {
	@NetworkedBasicField("m_vecTreeCircleCenter")
	public CircleCenter = new Vector3()

	public get RingRadius(): number {
		return 100
	}
}
