import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_penta_edged_sword extends Modifier {
	public SetBonusAttackRange(
		specialName = !this.IsRanged ? "melee_attack_range" : undefined,
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
