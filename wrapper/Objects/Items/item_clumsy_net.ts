import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_clumsy_net")
export class item_clumsy_net extends Item {
	public get Speed(): number {
		return 900
	}
}
