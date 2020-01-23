import Item from "../Base/Item"

export default class item_aegis extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Aegis>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_aegis", item_aegis)
