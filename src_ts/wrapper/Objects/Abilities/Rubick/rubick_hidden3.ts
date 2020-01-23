import Ability from "../../Base/Ability"

export default class rubick_hidden3 extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Rubick_Hidden3>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rubick_hidden3", rubick_hidden3)
