import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("chaos_knight_chaos_bolt")
export class chaos_knight_chaos_bolt extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseCastRangeForLevel(level: number): number {
		return (
			super.GetBaseCastRangeForLevel(level) +
			(this.Owner?.HasShard ?? false
				? this.GetSpecialValue("shard_bonus_cast_range", level)
				: 0)
		)
	}
}
