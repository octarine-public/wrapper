import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_nullifier")
export class item_nullifier extends Item {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
