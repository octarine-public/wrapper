import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_shadow_shaman_voodoo extends Modifier {
	protected SetFixedMoveSpeed(specialName = "movespeed"): void {
		if (this.Parent === undefined) {
			return
		}
		this.FixedMoveSpeed = !this.Parent.IsUnslowable
			? this.GetSpecialValue(specialName)
			: 0
	}
}
