import { Vector3 } from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { GridNav } from "../../Resources/ParseGNV"
import { Entity } from "./Entity"
import { TempTreeIDOffset } from "./Tree"

@WrapperClass("CDOTA_TempTree")
export class TempTree extends Entity {
	@NetworkedBasicField("m_vecTreeCircleCenter")
	public readonly CircleCenter = new Vector3()
	public readonly BinaryID: number

	constructor(index: number) {
		super(index, 0)
		this.BinaryID = TempTreeIDOffset + index
		this.ModelName = "models/props_tree/tree_oak_00.vmdl"
		this.OnModelUpdated()
		this.IsTree = true
		this.IsTempTree = true
	}

	public get IsAlive() {
		return true
	}
	public get RingRadius(): number {
		return 128
	}
	public OnModelUpdated(): void {
		super.OnModelUpdated()
		this.BoundingBox.MaxOffset.z = this.BoundingBox.MinOffset.z + 300
	}
}
export const TempTrees = EntityManager.GetEntitiesByClass(TempTree)

EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof TempTree) {
		GridNav?.UpdateTreeState(ent)
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof TempTree) {
		GridNav?.UpdateTreeState(ent)
	}
})
