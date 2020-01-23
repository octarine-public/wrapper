import Ability from "../../Base/Ability"

export default class faceless_void_time_lock extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_FacelessVoid_TimeLock>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("faceless_void_time_lock", faceless_void_time_lock)
