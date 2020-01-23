import Ability from "../../Base/Ability"

export default class wisp_tether_break extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Wisp_Tether_Break>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("wisp_tether_break", wisp_tether_break)
