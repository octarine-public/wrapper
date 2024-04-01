import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("phantom_assassin_stifling_dagger")
export class phantom_assassin_stifling_dagger extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("base_damage", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("dagger_speed", level)
	}
}
