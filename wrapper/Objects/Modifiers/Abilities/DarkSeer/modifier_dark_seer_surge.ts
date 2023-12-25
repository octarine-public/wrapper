import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dark_seer_surge extends Modifier {
	public SetBonusMoveSpeed(specialName = "speed_boost"): void {
		super.SetBonusMoveSpeed(specialName)
	}
}
