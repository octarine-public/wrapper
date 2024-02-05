import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_clinkz_strafe extends Modifier {
	public readonly IsBuff = true

	protected SetBonusAttackRange(
		specialName = "attack_range_bonus",
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}

	protected SetBonusAttackSpeed(
		specialName = "attack_speed_bonus",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
