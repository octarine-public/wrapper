import Item from "../Base/Item"

export default class item_repair_kit extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Repair_kit
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_repair_kit", item_repair_kit)