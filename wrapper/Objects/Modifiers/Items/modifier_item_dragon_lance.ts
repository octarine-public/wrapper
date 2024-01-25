import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_dragon_lance extends Modifier {
	public SetBonusAttackRange(
		specialName = this.IsRanged ? "base_attack_range" : undefined,
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
