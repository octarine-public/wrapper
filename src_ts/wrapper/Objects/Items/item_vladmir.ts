import Item from "../Base/Item"

export default class item_vladmir extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Vladmir>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_vladmir", item_vladmir)
