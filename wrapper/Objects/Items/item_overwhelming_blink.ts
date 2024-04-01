import { WrapperClass } from "../../Decorators"
import { item_blink } from "./item_blink"

@WrapperClass("item_overwhelming_blink")
export class item_overwhelming_blink extends item_blink {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
}
