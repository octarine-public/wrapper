import Item from "../Base/Item"

export default class item_elixer extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Elixer
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_elixer", item_elixer)
