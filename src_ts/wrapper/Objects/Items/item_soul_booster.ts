import Item from "../Base/Item"

export default class item_soul_booster extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Soul_Booster>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_soul_booster", item_soul_booster)
