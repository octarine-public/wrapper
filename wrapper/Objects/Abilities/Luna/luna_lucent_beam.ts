import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("luna_lucent_beam")
export class luna_lucent_beam extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("beam_damage", level)
	}
}
