import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("snapfire_mortimer_kisses")
export default class snapfire_mortimer_kisses extends Ability {
	public get Speed() {
		return this.GetSpecialValue("projectile_speed")
	}
	public get AOERadius() {
		return this.GetSpecialValue("impact_radius")
	}
}
