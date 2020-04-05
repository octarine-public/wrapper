import Ability from "../../Base/Ability"

export default class warlock_rain_of_chaos extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("aoe")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("warlock_rain_of_chaos", warlock_rain_of_chaos)
