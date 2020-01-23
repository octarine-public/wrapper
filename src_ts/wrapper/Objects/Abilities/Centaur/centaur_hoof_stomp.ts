import Ability from "../../Base/Ability"

export default class centaur_hoof_stomp extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Centaur_HoofStomp

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("centaur_hoof_stomp", centaur_hoof_stomp)
