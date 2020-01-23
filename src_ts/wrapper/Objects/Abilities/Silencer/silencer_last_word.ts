import Ability from "../../Base/Ability"

export default class silencer_last_word extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Silencer_LastWord>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("silencer_last_word", silencer_last_word)
