import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bloodseeker_rupture extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name
	public IsDebuff(): this is IDebuff {
		return true
	}
}
