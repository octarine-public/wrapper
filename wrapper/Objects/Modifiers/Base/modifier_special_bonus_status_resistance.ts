import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_status_resistance extends Modifier {
	protected SetStatusResistanceAmplifier(specialName = "value", subtract = false) {
		super.SetStatusResistanceAmplifier(specialName, subtract)
	}
}
