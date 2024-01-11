import { WrapperClass } from "../../../Decorators"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import { Ability } from "../../Base/Ability"

@WrapperClass("windrunner_windrun")
export class windrunner_windrun extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return this.Owner?.HasScepter
			? AbilityLogicType.Invisibility
			: AbilityLogicType.None
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
