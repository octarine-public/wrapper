import Item from "../Base/Item"

export default class item_pers extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Perseverance>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_pers", item_pers)
