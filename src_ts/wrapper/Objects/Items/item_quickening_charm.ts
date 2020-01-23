import Item from "../Base/Item"

export default class item_quickening_charm extends Item {
	public NativeEntity: Nullable<CDOTA_Item_Quickening_Charm>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_quickening_charm", item_quickening_charm)
