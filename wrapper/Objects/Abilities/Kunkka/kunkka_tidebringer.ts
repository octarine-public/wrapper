import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("kunkka_tidebringer")
export class kunkka_tidebringer extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage_bonus", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("cleave_distance", level)
	}
}
