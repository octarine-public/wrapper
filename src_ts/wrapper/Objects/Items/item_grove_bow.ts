import Item from "../Base/Item"

export default class item_grove_bow extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Grove_Bow
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_grove_bow", item_grove_bow)