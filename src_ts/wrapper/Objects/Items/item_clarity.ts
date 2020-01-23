import Item from "../Base/Item"

export default class item_clarity extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Clarity>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_clarity", item_clarity)
