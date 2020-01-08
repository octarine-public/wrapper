import Item from "../Base/Item"

export default class item_desolator_2 extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Desolator_2
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_desolator_2", item_desolator_2)
