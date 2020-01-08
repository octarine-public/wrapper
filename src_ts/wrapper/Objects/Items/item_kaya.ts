import Item from "../Base/Item"

export default class item_kaya extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Kaya
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_kaya", item_kaya)
