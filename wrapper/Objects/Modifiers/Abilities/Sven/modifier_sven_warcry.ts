import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sven_warcry extends Modifier {
	public SetMoveSpeedAmplifier(specialName = "movespeed", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
