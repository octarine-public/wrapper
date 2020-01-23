import EntityManager from "../../Managers/EntityManager"
import Entity from "./Entity"
import Item from "./Item"

export default class PhysicalItem extends Entity {
	public NativeEntity: Nullable<C_DOTA_Item_Physical>
	public Item_ = 0
	public OldItem_ = 0

	get Item(): Nullable<Item> {
		return EntityManager.EntityByIndex(this.Item_) as Nullable<Item>
	}
	get OldItem(): Nullable<Item> {
		return EntityManager.EntityByIndex(this.OldItem_) as Nullable<Item>
	}
	get ShowingTooltip(): boolean {
		return this.NativeEntity?.m_bShowingTooltip ?? false
	}

	public toString(): string {
		let item = this.Item
		if (item !== undefined)
			return item.Name

		let oldItem = this.OldItem
		if (oldItem !== undefined)
			return oldItem.Name

		return this.Name
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Item_Physical", PhysicalItem)
RegisterFieldHandler(PhysicalItem, "m_hItem", (item, new_value) => item.Item_ = new_value as number)
RegisterFieldHandler(PhysicalItem, "m_hOldItem", (item, new_value) => item.OldItem_ = new_value as number)
