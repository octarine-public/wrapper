import Ability from "../../Base/Ability"

export default class morphling_morph extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Morphling_Morph>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("morphling_morph", morphling_morph)
