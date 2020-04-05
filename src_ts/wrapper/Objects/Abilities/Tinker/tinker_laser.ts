import Ability from "../../Base/Ability"

export default class tinker_laser extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("laser_damage")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tinker_laser", tinker_laser)
