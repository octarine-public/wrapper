import Item from "../Base/Item"

export default class item_combo_breaker extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_AeonDisk>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_combo_breaker", item_combo_breaker)
