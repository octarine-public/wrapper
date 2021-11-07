import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("marci_grapple")
export default class marci_grapple extends Ability {
	public get Duration(): number {
		return this.GetSpecialValue("stun_duration")
	}
	public get AbilityDamage(): number {
		return this.GetSpecialValue("impact_damage")
	}
	public get AOERadius(): number {
		return this.GetSpecialValue("landing_radius")
	}
}
