import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_meepo_earthbind extends Modifier implements IDebuff, IDisable {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	public IsDebuff(): this is IDebuff {
		return true
	}
	public IsDisable(): this is IDisable {
		return true
	}
}
