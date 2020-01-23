import Item from "../Base/Item"

export default class item_ward_dispenser extends Item {
	public NativeEntity: Nullable<CDOTA_Item_Ward_Dispenser>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ward_dispenser", item_ward_dispenser)
