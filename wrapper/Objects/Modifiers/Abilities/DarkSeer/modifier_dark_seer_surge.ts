import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dark_seer_surge extends Modifier {
	protected SetBonusMoveSpeed(specialName = "speed_boost", subtract = false): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
