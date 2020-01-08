import Item from "../Base/Item"

export default class item_essence_ring extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Essence_Ring
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_essence_ring", item_essence_ring)
