import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("wisp_spirits")
export class wisp_spirits extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("hit_radius", level)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
}
