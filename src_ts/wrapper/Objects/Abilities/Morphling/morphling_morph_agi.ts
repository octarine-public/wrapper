import Ability from "../../Base/Ability"

export default class morphling_morph_agi extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Morphling_Morph_Agi>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("morphling_morph_agi", morphling_morph_agi)
