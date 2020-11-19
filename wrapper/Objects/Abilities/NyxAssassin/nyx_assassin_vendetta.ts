import { WrapperClass } from "../../../Decorators"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import Ability from "../../Base/Ability"

@WrapperClass("nyx_assassin_vendetta")
export default class nyx_assassin_vendetta extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
