import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_boots_of_bearing_aura extends Modifier {
	protected SetBonusMoveSpeed(
		specialName = "aura_movement_speed",
		subtract = false
	): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
