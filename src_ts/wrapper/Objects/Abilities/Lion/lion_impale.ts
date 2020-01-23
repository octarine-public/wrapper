import Ability from "../../Base/Ability"

export default class lion_impale extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Lion_Impale>

	public get AOERadius(): number {
		return this.GetSpecialValue("width")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lion_impale", lion_impale)
