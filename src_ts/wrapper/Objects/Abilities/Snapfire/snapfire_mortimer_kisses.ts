import Ability from "../../Base/Ability"

export default class snapfire_mortimer_kisses extends Ability {
	public get Speed() {
		return this.GetSpecialValue("projectile_speed")
	}
	public get AOERadius() {
		return this.GetSpecialValue("impact_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("snapfire_mortimer_kisses", snapfire_mortimer_kisses)
