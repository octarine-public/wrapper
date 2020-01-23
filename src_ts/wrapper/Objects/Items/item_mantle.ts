import Item from "../Base/Item"

export default class item_mantle extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Mantle>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_mantle", item_mantle)
