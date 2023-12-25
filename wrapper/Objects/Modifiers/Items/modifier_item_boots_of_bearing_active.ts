import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_boots_of_bearing_active extends Modifier {
	protected SetAmplifierMoveSpeed(specialName = "bonus_movement_speed_pct") {
		super.SetAmplifierMoveSpeed(specialName)
	}
}
