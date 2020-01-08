import Item from "../Base/Item"

export default class item_spirit_vessel extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Spirit_Vessel
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_spirit_vessel", item_spirit_vessel)
