import Item from "../Base/Item"

export default class item_ghost extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_GhostScepter
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ghost", item_ghost)
