import Ability from "../../Base/Ability"

export default class morphling_morph_str extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Morphling_Morph_Str>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("morphling_morph_str", morphling_morph_str)
