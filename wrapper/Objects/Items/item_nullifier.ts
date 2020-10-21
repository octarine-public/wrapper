import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_nullifier")
export default class item_nullifier extends Item {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public get ProjectileName() {
		return ["particles/items4_fx/nullifier_proj.vpcf"]
	}
}
