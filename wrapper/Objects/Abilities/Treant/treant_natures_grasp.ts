import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("treant_natures_grasp")
export class treant_natures_grasp extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage_per_second", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("latch_range", level)
	}

	public GetBaseSpeedForLevel(_level: number): number {
		// https://dota2.fandom.com/wiki/Treant_Protector
		return 1400
	}
}
