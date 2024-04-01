import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bristleback_quill_spray")
export class bristleback_quill_spray extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("quill_base_damage", level)
	}
}
