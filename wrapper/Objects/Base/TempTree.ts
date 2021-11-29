import Vector3 from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import EntityManager from "../../Managers/EntityManager"
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
		this.ModelName = "models/props_tree/tree_oak_00.vmdl"
		this.OnModelUpdated()
	}

	public get IsAlive() {
		return true
	}
	public get RingRadius(): number {
		return 128
	}
	public async OnModelUpdated(): Promise<void> {
		await super.OnModelUpdated()
		this.BoundingBox.MaxOffset.z = this.BoundingBox.MinOffset.z + 300
	}
}
export const TempTrees = EntityManager.GetEntitiesByClass(TempTree)
