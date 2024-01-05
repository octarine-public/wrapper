import { WrapperClass } from "../../../Decorators"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import { Ability } from "../../Base/Ability"

@WrapperClass("treant_natures_guise")
export class treant_natures_guise extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return this.Owner?.GetAbilityByName("special_bonus_unique_treant_4")?.Level !== 0
			? AbilityLogicType.Invisibility
			: AbilityLogicType.None
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
