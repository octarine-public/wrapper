import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bane_fiends_grip")
export class bane_fiends_grip extends Ability {
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
	public GetBaseChannelTimeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityChannelTime", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("fiend_grip_damage", level)
	}
}
