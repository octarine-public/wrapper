import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_grove_bow extends Modifier {
	public SetBonusAttackRange(
		specialName = this.IsRanged ? "attack_range_bonus" : undefined,
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
