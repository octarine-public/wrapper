import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("meepo_megameepo_fling")
export class meepo_megameepo_fling extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("fling_damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("fling_radius", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("fling_movespeed", level)
	}
}
