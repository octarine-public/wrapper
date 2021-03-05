import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_guardian_greaves")
export default class item_guardian_greaves extends Item {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("replenish_radius", level)
	}
}
