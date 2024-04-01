import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bounty_hunter_shuriken_toss")
export class bounty_hunter_shuriken_toss extends Ability {
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}

	public GetBaseCastRangeForLevel(level: number): number {
		return this.Owner?.HasScepter ?? false
			? this.GetSpecialValue("scepter_cast_range", level)
			: super.GetBaseCastRangeForLevel(level)
	}
}
