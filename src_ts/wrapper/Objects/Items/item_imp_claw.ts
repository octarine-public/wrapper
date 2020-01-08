import Item from "../Base/Item"

export default class item_imp_claw extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Imp_Claw
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_imp_claw", item_imp_claw)
