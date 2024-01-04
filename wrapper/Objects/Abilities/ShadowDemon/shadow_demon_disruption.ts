import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("shadow_demon_disruption")
export class shadow_demon_disruption extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetMaxChargesForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCharges", level)
	}
}
