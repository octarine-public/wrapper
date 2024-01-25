import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_clinkz_strafe extends Modifier {
	public readonly IsBuff = true

	protected SetBonusAttackRange(
		specialName = "attack_range_bonus",
		subtract?: boolean
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
