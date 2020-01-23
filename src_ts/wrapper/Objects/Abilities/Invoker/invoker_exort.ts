import Ability from "../../Base/Ability"

export default class invoker_exort extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Invoker_Exort>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_exort", invoker_exort)
