import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tusk_walrus_punch_air_time extends Modifier implements IDisable {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	public IsDisable(): this is IDisable {
		return true
	}
}
