import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("earthshaker_slugger")
export class earthshaker_slugger extends Ability {
	public GetBaseAOERadiusByTarget(target: Unit, level: number = this.Level): number {
		return target.IsHero
			? this.GetSpecialValue("projectile_body_width_hero", level)
			: this.GetSpecialValue("projectile_body_width_creep", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("projectile_body_initial_impact_radius", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_body_speed", level)
	}
}
