import Ability from "../../Base/Ability"

export default class faceless_void_time_dilation extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_FacelessVoid_TimeDilation>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("faceless_void_time_dilation", faceless_void_time_dilation)
