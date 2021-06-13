import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_keen_optic")
export default class item_keen_optic extends Item {
	public get BonusCastRange(): number {
		return this.GetSpecialValue("cast_range_bonus")
	}
}
