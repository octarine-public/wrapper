import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_mekansm")
export default class item_mekansm extends Item {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("heal_radius", level)
	}
}
