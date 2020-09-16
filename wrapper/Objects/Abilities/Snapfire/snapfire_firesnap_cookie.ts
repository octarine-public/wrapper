import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("snapfire_firesnap_cookie")
export default class snapfire_firesnap_cookie extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("impact_radius")
	}

	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
