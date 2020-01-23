import Ability from "../../Base/Ability"

export default class rubick_hidden1 extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Rubick_Hidden1>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rubick_hidden1", rubick_hidden1)
