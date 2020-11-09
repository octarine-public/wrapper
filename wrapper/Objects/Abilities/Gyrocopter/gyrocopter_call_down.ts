import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("gyrocopter_call_down")
export default class gyrocopter_call_down extends Ability {
	public get CastRange(): number {
		const talent = this.Owner?.GetAbilityByName("special_bonus_unique_gyrocopter_5")
		if (talent !== undefined && talent.Level !== 0)
			return Number.MAX_SAFE_INTEGER
		return super.CastRange
	}
}
