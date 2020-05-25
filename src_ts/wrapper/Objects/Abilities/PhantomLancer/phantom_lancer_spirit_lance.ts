import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("phantom_lancer_spirit_lance")
export default class phantom_lancer_spirit_lance extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("lance_damage")
	}
	public get Speed(): number {
		return this.GetSpecialValue("lance_speed")
	}
}
