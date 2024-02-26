import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ceremonial_robe_aura extends Modifier {
	public readonly IsDebuff = true

	protected SetStatusResistanceAmplifier(
		specialName = "status_resistance",
		subtract = true
	) {
		super.SetStatusResistanceAmplifier(specialName, subtract)
	}
}
