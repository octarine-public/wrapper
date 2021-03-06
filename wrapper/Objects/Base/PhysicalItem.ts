import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import EntityManager from "../../Managers/EntityManager"
import Entity from "./Entity"
import Item from "./Item"

@WrapperClass("CDOTA_Item_Physical")
export default class PhysicalItem extends Entity {
	@NetworkedBasicField("m_hItem")
	public Item_ = 0

	public get Item(): Nullable<Item> {
		return EntityManager.EntityByIndex(this.Item_) as Nullable<Item>
	}
	public get RingRadius(): number {
		return 40
	}

	public toString(): string {
		return this.Item?.Name ?? this.Name
	}
}
