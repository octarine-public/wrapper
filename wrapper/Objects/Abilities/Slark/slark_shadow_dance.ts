import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("slark_shadow_dance")
export class slark_shadow_dance extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("activation_delay", level)
	}
}
