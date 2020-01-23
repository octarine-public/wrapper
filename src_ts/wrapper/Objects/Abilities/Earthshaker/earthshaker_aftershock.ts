import Ability from "../../Base/Ability"

export default class earthshaker_aftershock extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Earthshaker_Aftershock

	public get AOERadius(): number {
		return this.GetSpecialValue("aftershock_range")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("earthshaker_aftershock", earthshaker_aftershock)
