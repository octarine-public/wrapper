import Ability from "../../Base/Ability"

export default class axe_berserkers_call extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Axe_BerserkersCall>

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("axe_berserkers_call", axe_berserkers_call)
