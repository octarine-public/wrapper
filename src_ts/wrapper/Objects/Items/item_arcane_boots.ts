import Item from "../Base/Item"

export default class item_arcane_boots extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Arcane_Boots>

	public get AuraRadius(): number {
		return this.GetSpecialValue("replenish_radius")
	}
	public get AOERadius(): number {
		return this.AuraRadius
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_arcane_boots", item_arcane_boots)
