import Item from "../Base/Item"

export default class item_mind_breaker extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Mind_Breaker
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_mind_breaker", item_mind_breaker)
