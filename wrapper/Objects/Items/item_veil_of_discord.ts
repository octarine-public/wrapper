import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_veil_of_discord")
export class item_veil_of_discord extends Item {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("debuff_radius", level)
	}
}
