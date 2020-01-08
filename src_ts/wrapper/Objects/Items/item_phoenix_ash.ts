import Item from "../Base/Item"

export default class item_phoenix_ash extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Phoenix_Ash
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_phoenix_ash", item_phoenix_ash)
