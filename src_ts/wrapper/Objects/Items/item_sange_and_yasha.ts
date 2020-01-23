import Item from "../Base/Item"

export default class item_sange_and_yasha extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_SangeAndYasha>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_sange_and_yasha", item_sange_and_yasha)
