import Item from "../Base/Item"

export default class item_lifesteal extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_MaskOfDeath>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_lifesteal", item_lifesteal)
