import { WrapperClass } from "../../../Decorators"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import Ability from "../../Base/Ability"

@WrapperClass("templar_assassin_meld")
export default class templar_assassin_meld extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_templar_assassin/templar_assassin_meld_attack.vpcf",
			"particles/econ/items/templar_assassin/templar_assassin_focal/templar_assassin_meld_focal_attack.vpcf",
		]
	}
}
