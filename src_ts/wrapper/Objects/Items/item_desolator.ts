import Item from "../Base/Item"

export default class item_desolator extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Desolator
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_desolator", item_desolator)
