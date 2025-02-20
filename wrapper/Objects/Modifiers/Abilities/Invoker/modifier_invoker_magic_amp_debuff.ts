import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invoker_magic_amp_debuff extends Modifier {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	public IsDebuff(): this is IDebuff {
		return true
	}
}
