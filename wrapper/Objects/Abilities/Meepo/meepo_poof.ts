import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("meepo_poof")
export class meepo_poof extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseCastPointForLevel(level: number): number {
		return this.GetSpecialValue("cast_duration", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("poof_damage", level)
	}
}
