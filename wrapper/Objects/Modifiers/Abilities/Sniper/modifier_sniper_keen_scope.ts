import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sniper_keen_scope extends Modifier {
	public SetBonusAttackRange(specialName = "bonus_range", subtract = false): void {
		if (this.IsPassiveDisabled()) {
			this.BonusAttackRange = 0
			return
		}
		super.SetBonusAttackRange(specialName, subtract)
	}
}
