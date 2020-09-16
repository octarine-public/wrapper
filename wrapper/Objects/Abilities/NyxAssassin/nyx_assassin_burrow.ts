import Ability from "../../Base/Ability"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("nyx_assassin_burrow")
export default class nyx_assassin_burrow extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
