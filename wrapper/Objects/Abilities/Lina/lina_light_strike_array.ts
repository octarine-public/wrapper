import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("lina_light_strike_array")
export class lina_light_strike_array extends Ability {
	public get ActivationDelay(): number {
		return this.GetSpecialValue("light_strike_array_delay_time")
	}
	public get AbilityDamage(): number {
		return this.GetSpecialValue("light_strike_array_damage")
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("light_strike_array_aoe", level)
	}
}
