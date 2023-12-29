import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_mask_of_madness_berserk extends Modifier {
	protected SetBonusMoveSpeed(
		specialName = "berserk_bonus_movement_speed",
		subtract = false
	): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
