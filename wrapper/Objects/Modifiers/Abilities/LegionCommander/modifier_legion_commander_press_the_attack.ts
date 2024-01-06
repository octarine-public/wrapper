import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_legion_commander_press_the_attack extends Modifier {
	public readonly IsBuff = true

	protected SetMoveSpeedAmplifier(specialName = "move_speed", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
