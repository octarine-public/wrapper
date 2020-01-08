import Item from "../Base/Item"

export default class item_skadi extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Skadi
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_skadi", item_skadi)
