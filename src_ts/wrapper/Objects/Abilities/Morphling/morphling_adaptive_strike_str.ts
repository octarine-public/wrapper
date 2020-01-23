import Ability from "../../Base/Ability"

export default class morphling_adaptive_strike_str extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Morphling_AdaptiveStrike_Str>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("morphling_adaptive_strike_str", morphling_adaptive_strike_str)
