import Item from "../Base/Item"

export default class item_gloves extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_GlovesOfHaste>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_gloves", item_gloves)
