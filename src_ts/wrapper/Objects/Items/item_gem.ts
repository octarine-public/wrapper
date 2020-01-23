import Item from "../Base/Item"

export default class item_gem extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_GemOfTrueSight>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_gem", item_gem)
