import Item from "../Base/Item"

export default class item_essence_ring extends Item {
	public NativeEntity: Nullable<CDOTA_Item_Essence_Ring>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_essence_ring", item_essence_ring)
