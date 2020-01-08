import Item from "../Base/Item"

export default class item_eagle extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Eaglehorn
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_eagle", item_eagle)
