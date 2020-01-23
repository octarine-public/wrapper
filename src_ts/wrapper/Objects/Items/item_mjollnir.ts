import Item from "../Base/Item"

export default class item_mjollnir extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Mjollnir>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_mjollnir", item_mjollnir)
