import Ability from "../../Base/Ability"

export default class invoker_chaos_meteor extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Invoker_ChaosMeteor>

	public get AOERadius(): number {
		return this.GetSpecialValue("area_of_effect")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_chaos_meteor", invoker_chaos_meteor)
