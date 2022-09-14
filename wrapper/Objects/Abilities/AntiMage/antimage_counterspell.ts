import { WrapperClass } from "../../../Decorators"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import { Ability } from "../../Base/Ability"

@WrapperClass("antimage_counterspell")
export class antimage_counterspell extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Reflect
	}
}
