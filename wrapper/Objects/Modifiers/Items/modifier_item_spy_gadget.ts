import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_spy_gadget extends Modifier {
	public readonly IsHidden = true

	public SetBonusAttackRange(
		specialName = this.IsRanged ? "attack_range" : undefined,
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
