import Item from "../Base/Item"

export default class item_dagon_4 extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Dagon_Upgraded4
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_dagon_4", item_dagon_4)
