import Ability from "../../Base/Ability"

export default class mars_spear extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("spear_width")
	}
	public get Speed(): number {
		return this.GetSpecialValue("spear_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("mars_spear", mars_spear)
