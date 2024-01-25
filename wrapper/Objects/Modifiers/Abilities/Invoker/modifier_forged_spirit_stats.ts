import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_forged_spirit_stats extends Modifier {
	// TODO: check -> quas level ?
	protected SetBonusAttackRange(
		specialName = "spirit_attack_range",
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
