import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_arcane_boots")
export default class item_arcane_boots extends Item {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("replenish_radius", level)
	}
}
