import Item from "../Base/Item"

export default class item_pocket_roshan extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_PocketRoshan
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_pocket_roshan", item_pocket_roshan)
