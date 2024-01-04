import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bristleback_bristleback")
export class bristleback_bristleback extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("activation_delay", level)
	}
}
