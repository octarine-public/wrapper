import Item from "../Base/Item"

export default class item_flask extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Flask
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_flask", item_flask)