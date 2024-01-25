import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sniper_take_aim extends Modifier {
	protected SetBonusAttackRange(
		specialName = "bonus_attack_range",
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
