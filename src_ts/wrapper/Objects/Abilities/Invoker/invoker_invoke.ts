import Ability from "../../Base/Ability"

export default class invoker_invoke extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Invoker_Invoke>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_invoke", invoker_invoke)
