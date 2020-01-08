import Item from "../Base/Item"

export default class item_wind_lace extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_WindLace
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_wind_lace", item_wind_lace)
