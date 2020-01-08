import Item from "../Base/Item"

export default class item_branches extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_IronwoodBranch
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_branches", item_branches)
