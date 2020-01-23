import Ability from "../../Base/Ability"

export default class rubick_arcane_supremacy extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Rubick_Arcane_Supremacy>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rubick_arcane_supremacy", rubick_arcane_supremacy)
