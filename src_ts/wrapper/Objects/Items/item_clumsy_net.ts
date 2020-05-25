import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_clumsy_net")
export default class item_clumsy_net extends Item {
	public get Speed(): number {
		return 900
	}
}
