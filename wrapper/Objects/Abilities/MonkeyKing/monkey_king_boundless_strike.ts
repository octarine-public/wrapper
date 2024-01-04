import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("monkey_king_boundless_strike")
export class monkey_king_boundless_strike extends Ability {
	public get SkillshotRange(): number {
		return this.CastRange + this.AOERadius
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("strike_radius", level)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
}
