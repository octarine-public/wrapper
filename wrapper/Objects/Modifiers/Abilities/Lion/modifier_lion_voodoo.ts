import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lion_voodoo extends Modifier {
	protected SetFixedMoveSpeed(specialName = "movespeed") {
		if (this.Parent === undefined) {
			return
		}
		this.FixedMoveSpeed = !this.Parent.IsUnslowable
			? this.GetSpecialValue(specialName)
			: 0
	}
}
