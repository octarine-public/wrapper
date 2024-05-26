import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lion_finger_punch extends Modifier {
	protected SetFixedAttackRange(specialName = "punch_attack_range", subtract = false) {
		super.SetFixedAttackRange(specialName, subtract)
	}
}
