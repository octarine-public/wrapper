import Item from "../Base/Item"

export default class item_magic_stick extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_MagicStick>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_magic_stick", item_magic_stick)
