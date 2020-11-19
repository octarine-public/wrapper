import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_rod_of_atos")
export default class item_rod_of_atos extends Item {
	public get Speed(): number {
		return 1500
	}
	public get ProjectileName() {
		return ["particles/items2_fx/rod_of_atos_attack.vpcf"]
	}
}
