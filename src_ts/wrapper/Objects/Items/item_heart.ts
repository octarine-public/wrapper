import Item from "../Base/Item"

export default class item_heart extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Heart>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_heart", item_heart)
