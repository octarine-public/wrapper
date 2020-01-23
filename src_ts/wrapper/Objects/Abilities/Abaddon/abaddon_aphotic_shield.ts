import Ability from "../../Base/Ability"

export default class abaddon_aphotic_shield extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Abaddon_AphoticShield>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("abaddon_aphotic_shield", abaddon_aphotic_shield)
