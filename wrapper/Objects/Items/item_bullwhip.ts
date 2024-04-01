import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_bullwhip")
export class item_bullwhip extends Item {
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
