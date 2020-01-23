import Ability from "../../Base/Ability"

export default class enigma_midnight_pulse extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Enigma_MidnightPulse>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("enigma_midnight_pulse", enigma_midnight_pulse)
