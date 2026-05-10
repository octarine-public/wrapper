import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("muerta_spectral_slug")
export class muerta_spectral_slug extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
}
