import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_active_conical_quill_spray extends Modifier {
	public readonly IsDebuff = true

	public SetMoveSpeedAmplifier(
		specialName = "activation_movement_speed_pct",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
