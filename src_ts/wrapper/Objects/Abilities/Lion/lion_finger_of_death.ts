import Ability from "../../Base/Ability"

export default class lion_finger_of_death extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Lion_FingerOfDeath

	public get AOERadius(): number {
		return this.GetSpecialValue("splash_radius_scepter")
	}

}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lion_finger_of_death", lion_finger_of_death)
