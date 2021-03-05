import { WrapperClass } from "../../../Decorators"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import Ability from "../../Base/Ability"

@WrapperClass("invoker_ghost_walk")
export default class invoker_ghost_walk extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("area_of_effect", level)
	}
}
