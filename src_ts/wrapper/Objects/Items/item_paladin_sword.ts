import Item from "../Base/Item"

export default class item_paladin_sword extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Paladin_Sword
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_paladin_sword", item_paladin_sword)
