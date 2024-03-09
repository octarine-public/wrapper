import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_shadow_amulet")
export class item_shadow_amulet extends Item {
	public get IsInvisibility() {
		return true
	}
}
