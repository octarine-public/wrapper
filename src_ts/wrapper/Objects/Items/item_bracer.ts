import Item from "../Base/Item"

export default class item_bracer extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Bracer>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_bracer", item_bracer)
