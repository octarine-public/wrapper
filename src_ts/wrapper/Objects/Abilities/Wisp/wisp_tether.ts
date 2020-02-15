import Ability from "../../Base/Ability"

export default class wisp_tether extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Wisp_Tether>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("wisp_tether", wisp_tether)
