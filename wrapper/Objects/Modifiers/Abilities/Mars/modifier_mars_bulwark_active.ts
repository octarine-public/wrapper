import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mars_bulwark_active extends Modifier {
	protected SetMoveSpeedAmplifier(
		specialName = "redirect_speed_penatly",
		subtract = true
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
