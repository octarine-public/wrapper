import Item from "../Base/Item"

export default class item_blade_of_alacrity extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_BladeOfAlacrity
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_blade_of_alacrity", item_blade_of_alacrity)
