import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_batrider_flaming_lasso
	extends Modifier
	implements IDebuff, IDisable
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	public IsDebuff(): this is IDebuff {
		return true
	}
	public IsDisable(): this is IDisable {
		return true
	}
}
