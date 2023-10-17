import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("phantom_lancer_spirit_lance")
export class phantom_lancer_spirit_lance extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("lance_damage")
	}
	public get Speed(): number {
		return this.GetSpecialValue("lance_speed")
	}
}
