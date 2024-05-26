import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("faceless_void_time_zone")
export class faceless_void_time_zone extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
}
