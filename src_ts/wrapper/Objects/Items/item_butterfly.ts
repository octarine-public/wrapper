import Item from "../Base/Item"

export default class item_butterfly extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Butterfly
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_butterfly", item_butterfly)
