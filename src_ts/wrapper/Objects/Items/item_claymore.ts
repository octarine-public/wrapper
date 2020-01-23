import Item from "../Base/Item"

export default class item_claymore extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Claymore>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_claymore", item_claymore)
