import Ability from "../../Base/Ability"

export default class wisp_spirits_out extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Wisp_Spirits_Out>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("wisp_spirits_out", wisp_spirits_out)
