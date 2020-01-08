import Item from "../Base/Item"

export default class item_refresher extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_RefresherOrb
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_refresher", item_refresher)
