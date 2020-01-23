import Ability from "../../Base/Ability"

export default class rubick_empty1 extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Rubick_Empty1>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rubick_empty1", rubick_empty1)
