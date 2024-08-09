import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("lina_light_strike_array")
export class lina_light_strike_array extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("light_strike_array_aoe", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("light_strike_array_damage", level)
	}
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("light_strike_array_delay_time", level)
	}
}
