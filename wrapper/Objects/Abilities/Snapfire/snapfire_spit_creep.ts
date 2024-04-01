import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("snapfire_spit_creep")
export class snapfire_spit_creep extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("impact_damage", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("impact_radius", level)
	}
}
