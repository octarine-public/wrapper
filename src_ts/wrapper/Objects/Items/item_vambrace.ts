import Item from "../Base/Item"

export default class item_vambrace extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Vambrace>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_vambrace", item_vambrace)
