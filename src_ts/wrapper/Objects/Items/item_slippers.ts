import Item from "../Base/Item"

export default class item_slippers extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Slippers>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_slippers", item_slippers)
