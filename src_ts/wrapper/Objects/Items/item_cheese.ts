import Item from "../Base/Item"

export default class item_cheese extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Cheese
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_cheese", item_cheese)