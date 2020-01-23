import Item from "../Base/Item"

export default class item_quarterstaff extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Quarterstaff>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_quarterstaff", item_quarterstaff)
