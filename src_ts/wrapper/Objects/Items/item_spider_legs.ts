import Item from "../Base/Item"

export default class item_spider_legs extends Item {
	public NativeEntity: Nullable<CDOTA_Item_Spider_Legs>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_spider_legs", item_spider_legs)
