import Item from "../Base/Item"

export default class item_vanguard extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Vanguard>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_vanguard", item_vanguard)
