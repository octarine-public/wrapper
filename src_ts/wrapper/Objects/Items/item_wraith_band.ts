import Item from "../Base/Item"

export default class item_wraith_band extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_WraithBand
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_wraith_band", item_wraith_band)
