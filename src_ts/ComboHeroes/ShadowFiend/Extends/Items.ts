//@ts-nocheck
import { Hero, Item } from "wrapper/Imports"
import { ItemBase } from "../Base/Items"
export default class ShadowFiendItems extends ItemBase {
	constructor(unit?: Hero) {
		super(unit)
	}
	// tested
	public get AeonDisc(): Nullable<Item> {
		let name = "item_combo_breaker"
		if (this.unit === undefined)
			return name as any
		return this.unit.GetItemByName(name)
	}
}
