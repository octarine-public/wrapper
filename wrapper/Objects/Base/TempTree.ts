import Vector3 from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import Entity from "./Entity"
import { TempTreeIDOffset } from "./Tree"

@WrapperClass("CDOTA_TempTree")
export default class TempTree extends Entity {
	@NetworkedBasicField("m_vecTreeCircleCenter")
	public CircleCenter = new Vector3()
	public BinaryID: number

	constructor(index: number) {
		super(index)
		this.BinaryID = TempTreeIDOffset + index
	}

	public get RingRadius(): number {
		return 64
	}
	public get IsAlive() {
		return true
	}
}
