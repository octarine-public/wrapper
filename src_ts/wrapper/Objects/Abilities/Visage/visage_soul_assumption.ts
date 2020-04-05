import Ability from "../../Base/Ability"

export default class visage_soul_assumption extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("bolt_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("visage_soul_assumption", visage_soul_assumption)
