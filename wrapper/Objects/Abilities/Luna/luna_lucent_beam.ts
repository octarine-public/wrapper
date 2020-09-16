import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("luna_lucent_beam")
export default class luna_lucent_beam extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("beam_damage")
	}
}
