import { WrapperClass } from "../../../Decorators"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import { Ability } from "../../Base/Ability"

@WrapperClass("oracle_false_promise")
export class oracle_false_promise extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return this.Owner?.GetAbilityByName("special_bonus_unique_oracle_4")?.Level !== 0
			? AbilityLogicType.Invisibility
			: AbilityLogicType.None
	}
}
