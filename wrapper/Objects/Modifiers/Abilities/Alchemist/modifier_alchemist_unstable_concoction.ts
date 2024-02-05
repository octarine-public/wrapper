import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_alchemist_unstable_concoction extends Modifier {
	public readonly IsBuff = true

	public SetMoveSpeedAmplifier(specialName = "move_speed", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
