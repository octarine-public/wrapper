import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("warlock_upheaval")
export class warlock_upheaval extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("aoe", level)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
}
