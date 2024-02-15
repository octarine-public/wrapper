import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("huskar_life_break")
export class huskar_life_break extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseCastRangeForLevel(level: number): number {
		return (
			super.GetBaseCastRangeForLevel(level) +
			(this.Owner?.HasScepter ?? false
				? this.GetSpecialValue("cast_range_bonus", level)
				: 0)
		)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("charge_speed", level)
	}
}
