import Ability from "../../Base/Ability"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("templar_assassin_meld")
export default class templar_assassin_meld extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
