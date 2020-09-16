import Ability from "../../Base/Ability"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("treant_natures_guise")
export default class treant_natures_guise extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return this.Owner?.GetAbilityByName("special_bonus_unique_treant_4")?.Level !== 0
			? AbilityLogicType.Invisibility
			: AbilityLogicType.None
	}
}
