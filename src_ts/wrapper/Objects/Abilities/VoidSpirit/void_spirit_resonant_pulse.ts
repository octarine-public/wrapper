import Ability from "../../Base/Ability"

export default class void_spirit_resonant_pulse extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_VoidSpirit_ResonantPulse>

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("void_spirit_resonant_pulse", void_spirit_resonant_pulse)
