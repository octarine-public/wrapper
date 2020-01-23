import Item from "../Base/Item"

export default class item_maelstrom extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Maelstrom>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_maelstrom", item_maelstrom)
