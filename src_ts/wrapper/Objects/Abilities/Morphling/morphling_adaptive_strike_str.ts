import Ability from "../../Base/Ability"

export default class morphling_adaptive_strike_str extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("morphling_adaptive_strike_str", morphling_adaptive_strike_str)
