import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mars_gods_rebuke_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(
		specialName = "knockback_slow",
		subtract = true
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
