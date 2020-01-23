import Item from "../Base/Item"

export default class item_greater_crit extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_GreaterCritical>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_greater_crit", item_greater_crit)
