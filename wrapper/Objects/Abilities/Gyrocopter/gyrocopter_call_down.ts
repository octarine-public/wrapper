import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("gyrocopter_call_down")
export class gyrocopter_call_down extends Ability {
	public GetCastRangeForLevel(level: number): number {
		const talent = this.Owner?.GetAbilityByName("special_bonus_unique_gyrocopter_5")
		if (talent !== undefined && talent.Level !== 0) {
			return Number.MAX_SAFE_INTEGER
		}
		return super.GetCastRangeForLevel(level)
	}
}
