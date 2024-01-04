import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_quicksilver_amulet extends Modifier {
	protected SetMoveSpeedAmplifier(
		specialName = "bonus_movement",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
