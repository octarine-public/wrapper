import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("medusa_mystic_snake")
export class medusa_mystic_snake extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}

	public GetBaseManaCostForLevel(level: number): number {
		return this.GetSpecialValue("AbilityManaCost", level)
	}

	public GetBaseCastPointForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastPoint", level)
	}

	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("initial_speed", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("snake_damage", level)
	}
}
