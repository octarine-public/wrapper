import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("phantom_lancer_spirit_lance")
export class phantom_lancer_spirit_lance extends Ability {
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("lance_speed", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("lance_damage", level)
	}
}
