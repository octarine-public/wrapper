import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_faded_broach extends Modifier {
	protected SetBonusMoveSpeed(specialName = "bonus_movement_speed"): void {
		super.SetBonusMoveSpeed(specialName)
	}
}
