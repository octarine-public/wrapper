import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_ascetic_cap extends Modifier {
	protected SetStatusResistanceAmplifier(
		specialName = "status_resistance",
		subtract = false
	) {
		super.SetStatusResistanceAmplifier(specialName, subtract)
	}
}
