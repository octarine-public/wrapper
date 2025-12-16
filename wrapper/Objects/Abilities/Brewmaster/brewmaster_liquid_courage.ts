import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("brewmaster_liquid_courage")
export class brewmaster_liquid_courage extends Ability {
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("drink_duration", level)
	}
}
