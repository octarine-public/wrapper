import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slardar_sprint_river extends Modifier {
	protected SetMoveSpeedAmplifier(specialName = "river_speed", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}

	protected SetStatusResistanceAmplifier(
		specialName = "puddle_status_resistance",
		subtract = false
	) {
		if (!this.Parent?.HasScepter) {
			this.StatusResistanceAmplifier = 0
			return
		}
		super.SetStatusResistanceAmplifier(specialName, subtract)
	}
}
