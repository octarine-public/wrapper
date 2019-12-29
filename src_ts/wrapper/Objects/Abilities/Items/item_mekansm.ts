import Item from "../../Base/Item"

export default class item_mekansm extends Item {
	public get AOERadius(): number {
		return this.GetSpecialValue("heal_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_mekansm", item_mekansm)
