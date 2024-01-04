import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("visage_soul_assumption")
export class visage_soul_assumption extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public get Speed(): number {
		return this.GetSpecialValue("bolt_speed")
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
