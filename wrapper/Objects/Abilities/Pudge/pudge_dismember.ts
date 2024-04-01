import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("pudge_dismember")
export class pudge_dismember extends Ability {
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}

	public GetBaseChannelTimeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityChannelTime", level)
	}
}
