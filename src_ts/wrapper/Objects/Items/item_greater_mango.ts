import Item from "../Base/Item"

export default class item_greater_mango extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Greater_Mango
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_greater_mango", item_greater_mango)
