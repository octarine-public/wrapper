import Ability from "../../Base/Ability"

export default class rubick_empty2 extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Rubick_Empty2>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rubick_empty2", rubick_empty2)
