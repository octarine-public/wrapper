import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_blink")
export class item_blink extends Item {
	public get IsCastRangeFake(): boolean {
		return true
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("blink_range", level)
	}
}
