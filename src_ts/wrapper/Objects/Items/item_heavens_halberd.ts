import Item from "../Base/Item"

export default class item_heavens_halberd extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_HeavensHalberd
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_heavens_halberd", item_heavens_halberd)
