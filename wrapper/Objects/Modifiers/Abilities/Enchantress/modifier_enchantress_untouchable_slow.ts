import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_enchantress_untouchable_slow extends Modifier {
	public readonly IsDebuff = true

	public SetBonusAttackSpeed(
		specialName = "slow_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
