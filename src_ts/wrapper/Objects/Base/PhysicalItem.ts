import EntityManager from "../../Managers/EntityManager"
import Entity from "./Entity"
import Item from "./Item"

export default class PhysicalItem extends Entity {
	public NativeEntity: Nullable<C_DOTA_Item_Physical>
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

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Item_Physical", PhysicalItem)
RegisterFieldHandler(PhysicalItem, "m_hItem", (item, new_value) => item.Item_ = new_value as number)
