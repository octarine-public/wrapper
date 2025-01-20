import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mars_spear_stun extends Modifier implements IDisable, IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	public IsDisable(): this is IDisable {
		return true
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
}
