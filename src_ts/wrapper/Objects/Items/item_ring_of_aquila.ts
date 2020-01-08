import Item from "../Base/Item"

export default class item_ring_of_aquila extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_RingOfAquila
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ring_of_aquila", item_ring_of_aquila)
