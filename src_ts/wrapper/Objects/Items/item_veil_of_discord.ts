import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_veil_of_discord")
export default class item_veil_of_discord extends Item {
	public get AOERadius(): number {
		return this.GetSpecialValue("debuff_radius")
	}
}
