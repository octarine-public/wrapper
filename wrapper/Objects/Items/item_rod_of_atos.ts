import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_rod_of_atos")
export class item_rod_of_atos extends Item {
	public get Speed(): number {
		return 1750
	}
}
