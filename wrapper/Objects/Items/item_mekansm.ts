import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_mekansm")
export default class item_mekansm extends Item {
	public get AOERadius(): number {
		return this.GetSpecialValue("heal_radius")
	}
}
