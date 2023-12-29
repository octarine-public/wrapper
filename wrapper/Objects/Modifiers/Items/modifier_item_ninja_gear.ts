import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_ninja_gear extends Modifier {
	protected SetBonusMoveSpeed(
		specialName = "passive_movement_bonus",
		subtract = false
	): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
