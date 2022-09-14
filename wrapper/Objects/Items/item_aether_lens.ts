import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_aether_lens")
export class item_aether_lens extends Item {
	public get BonusCastRange(): number {
		return this.GetSpecialValue("cast_range_bonus")
	}
}
