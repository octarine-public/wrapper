import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_brewmaster_primal_split_fire_phase extends Modifier {
	protected SetStatusResistanceAmplifier(
		specialName = "status_resistance",
		_subtract = false
	): void {
		const value = this.GetSpecialValue(specialName)
		this.StatusResistanceAmplifier = !this.IsPassiveDisabled() ? value / 100 : 0
	}
}
