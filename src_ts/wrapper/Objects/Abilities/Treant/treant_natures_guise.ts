import Ability from "../../Base/Ability"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"

export default class treant_natures_guise extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return this.Owner?.GetAbilityByName("special_bonus_unique_treant_4")?.Level !== 0
			? AbilityLogicType.Invisibility
			: AbilityLogicType.None
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("treant_natures_guise", treant_natures_guise)
