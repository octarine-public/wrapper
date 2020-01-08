import Ability from "../Base/Ability"

export default class morphling_waveform extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Morphling_Waveform
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("morphling_waveform", morphling_waveform)
