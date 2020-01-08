import Item from "../Base/Item"

export default class item_tpscroll extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_TeleportScroll
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_tpscroll", item_tpscroll)
