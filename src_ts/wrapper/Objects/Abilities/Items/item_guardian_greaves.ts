import Item from "../../Base/Item"

export default class item_guardian_greaves extends Item {
	public get AOERadius(): number {
		return this.GetSpecialValue("replenish_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_guardian_greaves", item_guardian_greaves)
