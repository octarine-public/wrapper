import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("monkey_king_primal_spring")
export class monkey_king_primal_spring extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("impact_radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("impact_damage", level)
	}
	public GetBaseSpeedForLevel(_level: number): number {
		// https://dota2.fandom.com/wiki/Monkey_King#Primal_Spring
		return 1300
	}
}
