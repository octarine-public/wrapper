import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_phase_boots_active extends Modifier {
	protected SetAmplifierMoveSpeed(_specialName?: string): void {
		super.SetAmplifierMoveSpeed(
			`${this.Parent?.IsRanged}`
				? "phase_movement_speed_range"
				: "phase_movement_speed"
		)
	}
}
