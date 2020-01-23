import Item from "../Base/Item"

export default class item_aeon_disk extends Item {
	public static readonly ModifierName: string = "modifier_item_aeon_disk_buff"

	public NativeEntity: Nullable<C_DOTA_Item_AeonDisk>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_aeon_disk", item_aeon_disk)
