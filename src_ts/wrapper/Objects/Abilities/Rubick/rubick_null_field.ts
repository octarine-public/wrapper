import Ability from "../../Base/Ability"

export default class rubick_null_field extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Rubick_NullField>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rubick_null_field", rubick_null_field)
