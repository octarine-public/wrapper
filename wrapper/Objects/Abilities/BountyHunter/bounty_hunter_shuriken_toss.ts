import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bounty_hunter_shuriken_toss")
export class bounty_hunter_shuriken_toss extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseCastRangeForLevel(level: number): number {
		return this.Owner?.HasScepter ?? false
			? this.GetSpecialValue("scepter_cast_range", level)
			: super.GetBaseCastRangeForLevel(level)
	}
}
