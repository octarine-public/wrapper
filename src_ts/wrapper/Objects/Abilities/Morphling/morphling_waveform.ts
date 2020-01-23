import Ability from "../../Base/Ability"

export default class morphling_waveform extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Morphling_Waveform>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("morphling_waveform", morphling_waveform)
