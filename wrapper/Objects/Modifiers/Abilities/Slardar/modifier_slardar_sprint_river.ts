import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slardar_sprint_river extends Modifier {
	public SetMoveSpeedAmplifier(specialName = "river_speed", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
