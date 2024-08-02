import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("primal_beast_onslaught")
export class primal_beast_onslaught extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("max_distance", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("charge_speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("knockback_damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("knockback_radius", level)
	}
}
