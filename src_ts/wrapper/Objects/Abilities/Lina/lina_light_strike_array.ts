import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("lina_light_strike_array")
export default class lina_light_strike_array extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("light_strike_array_aoe")
	}
	public get ActivationDelay(): number {
		return this.GetSpecialValue("light_strike_array_delay_time")
	}
	public get AbilityDamage(): number {
		return this.GetSpecialValue("light_strike_array_damage")
	}
}
