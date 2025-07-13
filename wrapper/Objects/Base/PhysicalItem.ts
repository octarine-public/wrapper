import { WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { GameState } from "../../Utils/GameState"
import { RegisterFieldHandler } from "../NativeToSDK"
import { Entity } from "./Entity"
import { Item } from "./Item"

@WrapperClass("CDOTA_Item_Physical")
export class PhysicalItem extends Entity {
	public Item_: number = EntityManager.INVALID_HANDLE
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
RegisterFieldHandler<PhysicalItem, number>(PhysicalItem, "m_hItem", (entity, newVal) => {
	entity.Item_ = newVal
	if (entity.Item !== undefined) {
		entity.Item.LastDroppedTime = GameState.RawGameTime
	}
})
