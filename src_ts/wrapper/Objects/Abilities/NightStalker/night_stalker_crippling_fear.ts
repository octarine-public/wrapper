import Ability from "../../Base/Ability"

export default class night_stalker_crippling_fear extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_NightStalker_CripplingFear>

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("night_stalker_crippling_fear", night_stalker_crippling_fear)
