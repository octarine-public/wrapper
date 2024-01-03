import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("necronomicon_warrior_sight")
export class necronomicon_warrior_sight extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
