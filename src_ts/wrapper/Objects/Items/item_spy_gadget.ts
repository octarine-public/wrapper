import Item from "../Base/Item"

export default class item_spy_gadget extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Spy_Gadget
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_spy_gadget", item_spy_gadget)