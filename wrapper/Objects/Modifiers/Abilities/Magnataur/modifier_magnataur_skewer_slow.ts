import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_magnataur_skewer_slow extends Modifier {
	public readonly IsDebuff = true

	// valve: error tooltip -> tool_attack_slow (10 20 30 40)
	// protected SetBonusAttackSpeed(specialName = "slow_pct", subtract = true): void {
	// 	super.SetBonusAttackSpeed(specialName, subtract)
	// }
}
