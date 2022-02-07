import { WrapperClass } from "../../../Decorators"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import Ability from "../../Base/Ability"

@WrapperClass("templar_assassin_meld")
export default class templar_assassin_meld extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_templar_assassin/templar_assassin_meld_attack.vpcf"
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
