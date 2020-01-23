import Ability from "../../Base/Ability"

export default class bloodseeker_blood_bath extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Bloodseeker_Bloodbath>

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bloodseeker_blood_bath", bloodseeker_blood_bath)
