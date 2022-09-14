import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_nullifier")
export class item_nullifier extends Item {
	public readonly ProjectilePath = "particles/items4_fx/nullifier_proj.vpcf"
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
