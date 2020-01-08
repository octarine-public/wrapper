import Item from "../Base/Item"

export default class item_talisman_of_evasion extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_TalismanOfEvasion
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_talisman_of_evasion", item_talisman_of_evasion)
