import Ability from "../../Base/Ability"

export default class pudge_meat_hook extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Pudge_MeatHook>

	public get AOERadius(): number {
		return this.GetSpecialValue("hook_width")
	}

	public get Speed(): number {
		return this.GetSpecialValue("hook_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pudge_meat_hook", pudge_meat_hook)
