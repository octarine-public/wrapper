import Ability from "../../Base/Ability"

export default class batrider_flamebreak extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Batrider_Flamebreak>

	public get AOERadius(): number {
		return this.GetSpecialValue("explosion_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("batrider_flamebreak", batrider_flamebreak)
