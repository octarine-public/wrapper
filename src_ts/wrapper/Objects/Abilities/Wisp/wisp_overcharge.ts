import Ability from "../../Base/Ability"

export default class wisp_overcharge extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Wisp_Overcharge>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("wisp_overcharge", wisp_overcharge)
