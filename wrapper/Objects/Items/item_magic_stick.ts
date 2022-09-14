import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_magic_stick")
export class item_magic_stick extends Item {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("charge_radius", level)
	}
}
