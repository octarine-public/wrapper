import Item from "../Base/Item"

export default class item_demonicon extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Demonicon
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_demonicon", item_demonicon)
