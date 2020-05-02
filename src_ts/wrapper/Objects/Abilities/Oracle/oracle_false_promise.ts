import Ability from "../../Base/Ability"

export default class oracle_false_promise extends Ability {
	public get IsInvisibilityType() {
		return this.Owner?.GetAbilityByName("special_bonus_unique_oracle_4")?.Level !== 0
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("oracle_false_promise", oracle_false_promise)
