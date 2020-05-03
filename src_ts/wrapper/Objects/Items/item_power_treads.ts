import Item from "../Base/Item"

export default class item_power_treads extends Item {
	public ActiveAttribute = 0
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_power_treads", item_power_treads)
RegisterFieldHandler(item_power_treads, "m_iStat", (item, new_val) => item.ActiveAttribute = new_val as number)
