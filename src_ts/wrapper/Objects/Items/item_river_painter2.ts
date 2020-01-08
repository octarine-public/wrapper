import Item from "../Base/Item"

export default class item_river_painter2 extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_RiverPainter2
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_river_painter2", item_river_painter2)
