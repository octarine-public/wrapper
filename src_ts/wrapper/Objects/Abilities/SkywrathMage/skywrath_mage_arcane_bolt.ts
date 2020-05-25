import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("skywrath_mage_arcane_bolt")
export default class skywrath_mage_arcane_bolt extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("bolt_speed")
	}
	public get AbilityDamage(): number {
		let damage = this.GetSpecialValue("bolt_damage")
		if (this.Owner !== undefined)
			damage += this.Owner.TotalIntellect * this.GetSpecialValue("int_multiplier")
		return damage
	}
}
