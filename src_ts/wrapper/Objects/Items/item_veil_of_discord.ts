import Item from "../Base/Item"

export default class item_veil_of_discord extends Item {
	public get AOERadius(): number {
		return this.GetSpecialValue("debuff_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_veil_of_discord", item_veil_of_discord)
