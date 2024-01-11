import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_wisp_tether extends Modifier {
	public readonly IsBuff = true

	protected SetMoveSpeedAmplifier(specialName = "movespeed", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
