import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { Entity } from "./Entity"
import { Item } from "./Item"

@WrapperClass("CDOTA_Item_Physical")
export class PhysicalItem extends Entity {
	@NetworkedBasicField("m_hItem")
	public Item_ = 0

	public get Item() {
		return EntityManager.EntityByIndex<Item>(this.Item_)
	}
	public get RingRadius(): number {
		return 64
	}

	public toString(): string {
		return this.Item?.Name ?? this.Name
	}
}
