import Ability from "../../Base/Ability"

export default class necrolyte_death_pulse extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("area_of_effect")
	}
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("necrolyte_death_pulse", necrolyte_death_pulse)
