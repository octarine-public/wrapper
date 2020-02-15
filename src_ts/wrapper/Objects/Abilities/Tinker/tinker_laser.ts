import Ability from "../../Base/Ability"

export default class tinker_laser extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Tinker_Laser>

	public get AbilityDamage(): number {
		return this.GetSpecialValue("laser_damage")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tinker_laser", tinker_laser)
