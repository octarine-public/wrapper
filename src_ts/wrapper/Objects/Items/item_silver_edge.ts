import Item from "../Base/Item"

export default class item_silver_edge extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Silver_Edge
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_silver_edge", item_silver_edge)