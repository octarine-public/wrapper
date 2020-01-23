import Item from "../Base/Item"

export default class item_enchanted_quiver extends Item {
	public NativeEntity: Nullable<CDOTA_Item_Enchanted_Quiver>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_enchanted_quiver", item_enchanted_quiver)
