import Item from "../Base/Item"

export default class item_crimson_guard extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Crimson_Guard
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_crimson_guard", item_crimson_guard)
