import Item from "../Base/Item"

export default class item_ironwood_tree extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Ironwood_tree
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ironwood_tree", item_ironwood_tree)
