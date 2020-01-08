import Item from "../Base/Item"

export default class item_rapier extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_DivineRapier
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_rapier", item_rapier)
