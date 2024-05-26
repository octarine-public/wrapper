import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sniper_take_aim_bonus extends Modifier {
	public SetBonusArmor(specialName = "bonus_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
	public SetBonusAttackRange(
		specialName = "active_attack_range_bonus",
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
