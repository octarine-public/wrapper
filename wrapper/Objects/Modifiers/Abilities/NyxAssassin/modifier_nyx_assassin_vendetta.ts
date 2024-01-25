import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_nyx_assassin_vendetta extends Modifier {
	public readonly IsBuff = true

	public SetBonusAttackRange(
		specialName = "attack_range_bonus",
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}
}
