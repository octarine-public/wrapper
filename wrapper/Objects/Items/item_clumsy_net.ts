import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_clumsy_net")
export class item_clumsy_net extends Item {
	public readonly ProjectilePath = "particles/items5_fx/clumsy_net_proj.vpcf"
	public get Speed(): number {
		return 900
	}
}
