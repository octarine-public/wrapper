import Item from "../Base/Item"

export default class item_titan_sliver extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Titan_Sliver
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_titan_sliver", item_titan_sliver)