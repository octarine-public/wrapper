import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("tusk_snowball")
export class tusk_snowball extends Ability {
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("snowball_speed", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("snowball_radius", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("snowball_damage", level)
	}
}
