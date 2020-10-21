import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"

@WrapperClass("antimage_counterspell")
export default class antimage_counterspell extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Reflect
	}
}
