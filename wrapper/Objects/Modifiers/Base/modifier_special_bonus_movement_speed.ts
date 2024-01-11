import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_movement_speed extends Modifier {
	public readonly IsHidden = true

	protected SetBonusMoveSpeed(specialName = "value", subtract = false): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
