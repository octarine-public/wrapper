import Item from "../Base/Item"

export default class item_ring_of_basilius extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Ring_Of_Basilius
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ring_of_basilius", item_ring_of_basilius)
