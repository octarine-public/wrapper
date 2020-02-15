import Ability from "../../Base/Ability"

export default class rubick_fade_bolt extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Rubick_FadeBolt>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rubick_fade_bolt", rubick_fade_bolt)
