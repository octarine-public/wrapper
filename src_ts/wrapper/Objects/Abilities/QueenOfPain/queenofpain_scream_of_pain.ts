import Ability from "../../Base/Ability"

export default class queenofpain_scream_of_pain extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("area_of_effect")
	}

	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("queenofpain_scream_of_pain", queenofpain_scream_of_pain)
