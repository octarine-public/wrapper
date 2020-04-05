import Ability from "../../Base/Ability"

export default class earthshaker_aftershock extends Ability {

	public get AOERadius(): number {
		return this.GetSpecialValue("aftershock_range")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("earthshaker_aftershock", earthshaker_aftershock)
