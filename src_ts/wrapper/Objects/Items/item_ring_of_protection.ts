import Item from "../Base/Item"

export default class item_ring_of_protection extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_RingOfProtection>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ring_of_protection", item_ring_of_protection)
