import Item from "../Base/Item"

export default class item_shadow_amulet extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_ShadowAmulet
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_shadow_amulet", item_shadow_amulet)
