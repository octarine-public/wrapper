import Item from "../Base/Item"

export default class item_cyclone extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Cyclone
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_cyclone", item_cyclone)
