import Ability from "../../Base/Ability"

export default class rubick_hidden2 extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Rubick_Hidden2>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rubick_hidden2", rubick_hidden2)
