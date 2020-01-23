import Item from "../Base/Item"

export default class item_craggy_coat extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Craggy_Coat>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_craggy_coat", item_craggy_coat)
