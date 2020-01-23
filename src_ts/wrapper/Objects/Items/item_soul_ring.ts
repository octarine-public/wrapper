import Item from "../Base/Item"

export default class item_soul_ring extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Soul_Ring>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_soul_ring", item_soul_ring)
