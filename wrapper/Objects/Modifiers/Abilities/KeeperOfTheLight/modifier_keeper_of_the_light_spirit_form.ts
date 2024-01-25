import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_keeper_of_the_light_spirit_form extends Modifier {
	public readonly IsBuff = true

	protected SetBonusCastRange(specialName = "cast_range", subtract = false): void {
		super.SetBonusCastRange(specialName, subtract)
	}
}
