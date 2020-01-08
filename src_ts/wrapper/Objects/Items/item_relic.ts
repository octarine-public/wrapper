import Item from "../Base/Item"

export default class item_relic extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_SacredRelic
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_relic", item_relic)
