import Item from "../Base/Item"

export default class item_javelin extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Javelin
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_javelin", item_javelin)
