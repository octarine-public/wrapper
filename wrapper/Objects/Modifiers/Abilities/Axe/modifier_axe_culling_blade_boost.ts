import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_culling_blade_boost extends Modifier {
	public readonly IsBuff = true

	public SetMoveSpeedAmplifier(specialName = "speed_bonus", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
