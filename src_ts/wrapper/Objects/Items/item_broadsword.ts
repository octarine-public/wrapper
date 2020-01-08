import Item from "../Base/Item"

export default class item_broadsword extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Broadsword
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_broadsword", item_broadsword)
