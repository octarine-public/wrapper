import Item from "../Base/Item"

export default class item_satanic extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Satanic
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_satanic", item_satanic)
