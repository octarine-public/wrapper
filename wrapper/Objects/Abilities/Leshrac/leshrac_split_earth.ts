import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("leshrac_split_earth")
export class leshrac_split_earth extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("delay", level)
	}
}
