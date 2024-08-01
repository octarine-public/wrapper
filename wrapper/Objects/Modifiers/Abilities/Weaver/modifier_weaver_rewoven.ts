import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_weaver_rewoven extends Modifier {
	public SetBonusAttackRange(
		specialName = "attack_range_increase_per_stack",
		subtract = false
	): void {
		const value = this.GetSpecialValue(specialName)
		this.BonusAttackRange = (subtract ? value * -1 : value) * this.StackCount
	}
}
