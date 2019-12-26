//@ts-nocheck
import { Hero, Item } from "wrapper/Imports"
import { ItemBase } from "../../Base/Items"
export default class ItemsX extends ItemBase {
	constructor(unit?: Hero) {
		super(unit)
	}
	// tested
	public get AeonDisc(): Item {
		return this.unit.GetItemByName("item_combo_breaker")
	}
}