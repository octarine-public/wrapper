import Item from "../Base/Item"

export default class item_river_painter7 extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_RiverPainter7
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_river_painter7", item_river_painter7)
