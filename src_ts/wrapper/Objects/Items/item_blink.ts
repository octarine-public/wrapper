import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_blink")
export default class item_blink extends Item {
	public get BaseCastRange(): number {
		return this.GetSpecialValue("blink_range")
	}
}
