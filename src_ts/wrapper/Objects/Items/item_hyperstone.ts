import Item from "../Base/Item"

export default class item_hyperstone extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Hyperstone>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_hyperstone", item_hyperstone)
