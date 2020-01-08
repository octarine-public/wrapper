import Item from "../Base/Item"

export default class item_river_painter extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_RiverPainter
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_river_painter", item_river_painter)
