import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_elven_tunic extends Modifier {
	protected SetMoveSpeedAmplifier(specialName = "movment", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
