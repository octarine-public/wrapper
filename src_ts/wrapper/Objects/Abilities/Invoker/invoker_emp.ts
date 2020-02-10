import Ability from "../../Base/Ability"

export default class invoker_emp extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Invoker_EMP>

	public get AOERadius(): number {
		return this.GetSpecialValue("area_of_effect")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_emp", invoker_emp)