import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_templar_assassin_psi_blades extends Modifier {
	protected SetBonusAttackRange(
		specialName = "bonus_attack_range",
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
