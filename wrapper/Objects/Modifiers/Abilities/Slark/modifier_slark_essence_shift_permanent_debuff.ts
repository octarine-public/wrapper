import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slark_essence_shift_permanent_debuff
	extends Modifier
	implements IDebuff
{
	public readonly DebuffModifierName = this.Name

	public IsDebuff(): this is IDebuff {
		return this.StackCount !== 0
	}
}
