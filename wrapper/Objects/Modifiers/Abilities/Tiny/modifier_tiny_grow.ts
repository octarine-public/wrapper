import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tiny_grow extends Modifier {
	protected SetAttackSpeedAmplifier(
		specialName = "attack_speed_reduction",
		subtract = false
	): void {
		super.SetAttackSpeedAmplifier(specialName, subtract)
	}

	protected SetBonusArmor(specialName = "bonus_armor", subtract = false) {
		super.SetBonusArmor(specialName, subtract)
	}
}
