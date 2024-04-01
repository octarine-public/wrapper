import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("abaddon_death_coil")
export class abaddon_death_coil extends Ability {
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("missile_speed", level)
	}
}
