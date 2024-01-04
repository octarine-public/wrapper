import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_yasha extends Modifier {
	protected SetMoveSpeedAmplifier(
		specialName = "movement_speed_percent_bonus",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
