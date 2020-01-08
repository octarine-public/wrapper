import Ability from "../Base/Ability"

export default class pudge_meat_hook extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Pudge_MeatHook

	public get AOERadius(): number {
		return this.GetSpecialValue("hook_width")
	}

	public get Speed(): number {
		return this.GetSpecialValue("hook_width")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pudge_meat_hook", pudge_meat_hook)
