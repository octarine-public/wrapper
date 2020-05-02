import Ability from "../../Base/Ability"

export default class treant_natures_guise extends Ability {
	public get IsInvisibilityType() {
		return this.Owner?.GetAbilityByName("special_bonus_unique_treant_4")?.Level !== 0
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("treant_natures_guise", treant_natures_guise)
