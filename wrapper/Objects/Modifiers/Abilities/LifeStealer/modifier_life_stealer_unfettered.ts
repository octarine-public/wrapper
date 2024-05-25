import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_life_stealer_unfettered extends Modifier {
	protected SetStatusResistanceAmplifier(
		specialName = "status_resist",
		subtract = false
	): void {
		super.SetStatusResistanceAmplifier(specialName, subtract)
	}
}
