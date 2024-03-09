import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_invis_sword")
export class item_invis_sword extends Item {
	public get IsInvisibility() {
		return true
	}
}
