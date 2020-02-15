import Ability from "../../Base/Ability"

export default class leshrac_pulse_nova extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Leshrac_Pulse_Nova>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("leshrac_pulse_nova", leshrac_pulse_nova)
