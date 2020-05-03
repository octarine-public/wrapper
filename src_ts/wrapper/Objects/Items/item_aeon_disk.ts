import Item from "../Base/Item"

export default class item_aeon_disk extends Item {
	public static readonly ModifierName: string = "modifier_item_aeon_disk_buff"}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_aeon_disk", item_aeon_disk)
