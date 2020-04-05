import Ability from "../../Base/Ability"

export default class warlock_fatal_bonds extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("search_aoe")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("warlock_fatal_bonds", warlock_fatal_bonds)
