import Item from "../Base/Item"

export default class item_yasha_and_kaya extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Yasha_And_Kaya
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_yasha_and_kaya", item_yasha_and_kaya)
