import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_huskar_inner_fire_disarm extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(
		specialName = "movement_slow_pct",
		subtract = true
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
