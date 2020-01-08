import Item from "../Base/Item"

export default class item_headdress extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Headdress
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_headdress", item_headdress)
