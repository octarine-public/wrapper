import Item from "../Base/Item"

export default class item_orchid extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_OrchidMalevolence
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_orchid", item_orchid)