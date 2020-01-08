import Item from "../Base/Item"

export default class item_reaver extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Reaver
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_reaver", item_reaver)
