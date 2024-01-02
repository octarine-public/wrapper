import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("troll_warlord_whirling_axes_melee")
export class troll_warlord_whirling_axes_melee extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("max_range", level)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
}
