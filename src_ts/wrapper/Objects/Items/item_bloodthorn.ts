import Item from "../Base/Item"

export default class item_bloodthorn extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Bloodthorn
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_bloodthorn", item_bloodthorn)
