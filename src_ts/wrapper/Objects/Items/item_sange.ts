import Item from "../Base/Item"

export default class item_sange extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Sange>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_sange", item_sange)
