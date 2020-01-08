import Item from "../Base/Item"

export default class item_lesser_crit extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_LesserCritical
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_lesser_crit", item_lesser_crit)
