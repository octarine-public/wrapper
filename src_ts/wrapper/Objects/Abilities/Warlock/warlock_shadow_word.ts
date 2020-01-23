import Ability from "../../Base/Ability"

export default class warlock_shadow_word extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Warlock_Shadow_Word>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("warlock_shadow_word", warlock_shadow_word)
