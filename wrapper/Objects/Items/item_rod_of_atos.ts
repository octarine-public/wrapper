import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_rod_of_atos")
export class item_rod_of_atos extends Item {
	public readonly ProjectilePath = "particles/items2_fx/rod_of_atos_attack.vpcf"
	public get Speed(): number {
		return 1750
	}
}
