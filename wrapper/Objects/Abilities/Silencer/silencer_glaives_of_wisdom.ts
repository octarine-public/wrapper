import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("silencer_glaives_of_wisdom")
export class silencer_glaives_of_wisdom extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetRawDamage(_target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || owner.Mana < this.ManaCost) {
			return 0
		}
		return (owner.TotalIntellect * this.GetSpecialValue("intellect_damage_pct")) / 100
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner,
			baseDamage = super.GetDamage(target)
		if (owner === undefined || baseDamage === 0) {
			return baseDamage
		}
		if (this.IsAutoCastEnabled) {
			return owner.GetAttackDamage(target)
		}
		return baseDamage + owner.GetAttackDamage(target)
	}
}
