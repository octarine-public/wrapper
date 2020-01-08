import Item from "../Base/Item"

export default class item_tango extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Tango
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_tango", item_tango)
