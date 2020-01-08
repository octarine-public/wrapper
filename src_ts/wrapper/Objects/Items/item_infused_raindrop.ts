import Item from "../Base/Item"

export default class item_infused_raindrop extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Infused_Raindrop
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_infused_raindrop", item_infused_raindrop)
