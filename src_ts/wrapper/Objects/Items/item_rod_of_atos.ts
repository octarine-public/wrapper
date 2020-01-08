import Item from "../Base/Item"

export default class item_rod_of_atos extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_RodOfAtos
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_rod_of_atos", item_rod_of_atos)
