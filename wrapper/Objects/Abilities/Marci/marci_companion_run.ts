import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("marci_companion_run")
export class marci_companion_run extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("move_speed")
	}
	public get AbilityDamage(): number {
		return this.GetSpecialValue("impact_damage")
	}
	public get AOERadius(): number {
		return this.GetSpecialValue("landing_radius")
	}
}
