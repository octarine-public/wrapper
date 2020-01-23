import Item from "../Base/Item"

export default class item_invis_sword extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_InvisibilityEdge>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_invis_sword", item_invis_sword)
