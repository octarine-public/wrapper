import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dawnbreaker_converge extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(specialName = "move_slow", subtract = true): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
