import Item from "../Base/Item"

export default class item_blight_stone extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Blight_Stone
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_blight_stone", item_blight_stone)
