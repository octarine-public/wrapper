import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_ancient_janggo_active extends Modifier {
	protected SetMoveSpeedAmplifier(
		specialName = "bonus_movement_speed_pct",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
