import Item from "../Base/Item"

export default class item_mystic_staff extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_MysticStaff>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_mystic_staff", item_mystic_staff)
