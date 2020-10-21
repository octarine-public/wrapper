import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_rod_of_atos")
export default class item_rod_of_atos extends Item {
	public get Speed(): number {
		return 1500
	}
	public get ProjectileName() {
		return []
	}
}
