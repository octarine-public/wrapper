import Item from "../Base/Item"

export default class item_crown extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Crown
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_crown", item_crown)
