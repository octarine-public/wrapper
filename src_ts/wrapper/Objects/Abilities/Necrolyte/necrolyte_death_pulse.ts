import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("necrolyte_death_pulse")
export default class necrolyte_death_pulse extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("area_of_effect")
	}
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
