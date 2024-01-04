import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_arcane_boots")
export class item_arcane_boots extends Item {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("replenish_radius", level)
	}
}
