import Item from "../Base/Item"

export default class item_courier extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Courier
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_courier", item_courier)