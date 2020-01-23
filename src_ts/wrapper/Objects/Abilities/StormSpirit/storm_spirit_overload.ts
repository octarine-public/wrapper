import Ability from "../../Base/Ability"

export default class storm_spirit_overload extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_StormSpirit_Overload>

	public get AOERadius(): number {
		return this.GetSpecialValue("overload_aoe")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("storm_spirit_overload", storm_spirit_overload)
