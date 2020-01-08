import Item from "../Base/Item"

export default class item_dust extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_DustofAppearance
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_dust", item_dust)
