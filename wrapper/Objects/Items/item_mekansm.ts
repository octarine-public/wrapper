import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_mekansm")
export default class item_mekansm extends Item {
	public get AOERadius(): number {
		return this.GetSpecialValue("heal_radius")
	}
}
