import Item from "../Base/Item"

export default class item_flicker extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Flicker
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_flicker", item_flicker)
