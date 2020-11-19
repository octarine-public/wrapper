import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_clumsy_net")
export default class item_clumsy_net extends Item {
	public get Speed(): number {
		return 900
	}
	public get ProjectileName() {
		return ["particles/items5_fx/clumsy_net_proj.vpcf"]
	}
}
