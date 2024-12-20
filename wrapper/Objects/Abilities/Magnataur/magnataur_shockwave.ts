import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("magnataur_shockwave")
export class magnataur_shockwave extends Ability {
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("shock_speed", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("shock_width", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("shock_damage", level)
	}
}
