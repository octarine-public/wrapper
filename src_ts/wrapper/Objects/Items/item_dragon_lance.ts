import Item from "../Base/Item"

export default class item_dragon_lance extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_DragonLance
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_dragon_lance", item_dragon_lance)
