import Ability from "../../Base/Ability"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("invoker_ghost_walk")
export default class invoker_ghost_walk extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
	public get AOERadius(): number {
		return this.GetSpecialValue("area_of_effect")
	}
}
