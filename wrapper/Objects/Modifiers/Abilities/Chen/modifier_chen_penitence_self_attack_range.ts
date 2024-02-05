import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_chen_penitence_self_attack_range extends Modifier {
	protected SetBonusAttackRange(
		specialName = this.Parent === this.Caster ? "self_attack_range_bonus" : undefined,
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
