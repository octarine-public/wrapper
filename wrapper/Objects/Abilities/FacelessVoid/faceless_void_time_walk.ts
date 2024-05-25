import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("faceless_void_time_walk")
export class faceless_void_time_walk extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("range", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
