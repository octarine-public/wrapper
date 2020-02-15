import Ability from "../../Base/Ability"

export default class faceless_void_chronosphere extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_FacelessVoid_Chronosphere>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("faceless_void_chronosphere", faceless_void_chronosphere)
