import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("plus_high_five")
export class plus_high_five extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("acknowledge_range", level)
	}
}
