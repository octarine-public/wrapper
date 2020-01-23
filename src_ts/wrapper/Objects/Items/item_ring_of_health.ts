import Item from "../Base/Item"

export default class item_ring_of_health extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_RingOfHealth>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ring_of_health", item_ring_of_health)
