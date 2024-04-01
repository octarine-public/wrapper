import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("sven_storm_bolt")
export class sven_storm_bolt extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("bolt_aoe", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("bolt_speed", level)
	}
}
