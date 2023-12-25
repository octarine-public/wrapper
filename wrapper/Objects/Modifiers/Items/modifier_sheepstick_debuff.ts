import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sheepstick_debuff extends Modifier {
	protected SetFixedMoveSpeed(specialName = "sheep_movement_speed"): void {
		if (this.Parent === undefined) {
			return
		}
		this.FixedMoveSpeed = !this.Parent.IsUnslowable
			? this.GetSpecialValue(specialName)
			: 0
	}
}
