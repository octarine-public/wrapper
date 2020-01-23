import Item from "../Base/Item"

export default class item_greater_faerie_fire extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Greater_Faerie_Fire>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_greater_faerie_fire", item_greater_faerie_fire)
