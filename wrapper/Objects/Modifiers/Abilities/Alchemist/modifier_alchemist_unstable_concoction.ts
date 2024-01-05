import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_alchemist_unstable_concoction extends Modifier {
	public readonly IsBuff = true

	public SetMoveSpeedAmplifier(specialName = "move_speed", subtract?: boolean): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
