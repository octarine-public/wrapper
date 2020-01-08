import Item from "../Base/Item"

export default class item_dimensional_doorway extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Dimensional_Doorway
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_dimensional_doorway", item_dimensional_doorway)
