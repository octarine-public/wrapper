import Ability from "../../Base/Ability"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"

export default class oracle_false_promise extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return this.Owner?.GetAbilityByName("special_bonus_unique_oracle_4")?.Level !== 0
			? AbilityLogicType.Invisibility
			: AbilityLogicType.None
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("oracle_false_promise", oracle_false_promise)
