import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_naga_siren_deluge_status_resistance extends Modifier {
	public readonly IsDebuff = true
	protected SetStatusResistanceAmplifier(
		specialName = "status_resistance",
		subtract = false
	): void {
		super.SetStatusResistanceAmplifier(specialName, subtract)
	}
}
