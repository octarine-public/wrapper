import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tinker_heat_seeking_missile")
export class tinker_heat_seeking_missile extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
