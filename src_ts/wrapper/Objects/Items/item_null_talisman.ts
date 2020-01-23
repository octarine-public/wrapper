import Item from "../Base/Item"

export default class item_null_talisman extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_NullTalisman>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_null_talisman", item_null_talisman)
