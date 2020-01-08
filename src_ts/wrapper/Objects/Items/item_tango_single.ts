import Item from "../Base/Item"

export default class item_tango_single extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Tango_Single
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_tango_single", item_tango_single)
