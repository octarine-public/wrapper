import Item from "../Base/Item"

export default class item_holy_locket extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Holy_Locket
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_holy_locket", item_holy_locket)
