import Ability from "../../Base/Ability"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("weaver_shukuchi")
export default class weaver_shukuchi extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
