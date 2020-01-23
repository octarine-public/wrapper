import Item from "../Base/Item"

export default class item_pupils_gift extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Pupils_gift>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_pupils_gift", item_pupils_gift)
