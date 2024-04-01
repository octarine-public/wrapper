import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dawnbreaker_celestial_hammer")
export class dawnbreaker_celestial_hammer extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("range", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("hammer_damage", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("hammer_aoe_radius", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
}
