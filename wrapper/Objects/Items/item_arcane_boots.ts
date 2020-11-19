import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_arcane_boots")
export default class item_arcane_boots extends Item {
	public get AuraRadius(): number {
		return this.GetSpecialValue("replenish_radius")
	}
	public get AOERadius(): number {
		return this.AuraRadius
	}
}
