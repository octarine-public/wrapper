import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dawnbreaker_fire_wreath_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(specialName = "swipe_slow", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
