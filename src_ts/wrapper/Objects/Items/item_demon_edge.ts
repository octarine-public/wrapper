import Item from "../Base/Item"

export default class item_demon_edge extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_DemonEdge
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_demon_edge", item_demon_edge)