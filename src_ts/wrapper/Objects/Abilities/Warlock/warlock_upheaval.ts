import Ability from "../../Base/Ability"

export default class warlock_upheaval extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("aoe")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("warlock_upheaval", warlock_upheaval)
