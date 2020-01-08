import Item from "../Base/Item"

export default class item_hurricane_pike extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Hurricane_Pike
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_hurricane_pike", item_hurricane_pike)
