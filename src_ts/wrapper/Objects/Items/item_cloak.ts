import Item from "../Base/Item"

export default class item_cloak extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_PlaneswalkersCloak
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_cloak", item_cloak)
