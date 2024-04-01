import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("drow_ranger_multishot")
export class drow_ranger_multishot extends Ability {
	// public GetCastRangeForLevel(level: number): number {
	// 	return (this.Owner?.AttackRange ?? 0) * this.GetSpecialValue("arrow_range_multiplier", level)
	// }

	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("arrow_speed", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("arrow_width", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("arrow_damage_pct", level)
	}
}
