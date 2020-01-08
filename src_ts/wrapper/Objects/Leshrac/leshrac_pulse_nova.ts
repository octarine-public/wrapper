import Ability from "../Base/Ability"

export default class leshrac_pulse_nova extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Leshrac_Pulse_Nova

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("leshrac_pulse_nova", leshrac_pulse_nova)
