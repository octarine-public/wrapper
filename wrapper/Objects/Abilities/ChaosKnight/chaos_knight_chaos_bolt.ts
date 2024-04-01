import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("chaos_knight_chaos_bolt")
export class chaos_knight_chaos_bolt extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		return (
			super.GetBaseCastRangeForLevel(level) +
			(this.Owner?.HasShard ?? false
				? this.GetSpecialValue("shard_bonus_cast_range", level)
				: 0)
		)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("chaos_bolt_speed", level)
	}
}
