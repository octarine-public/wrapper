import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tinker_defense_matrix extends Modifier {
	private cachedStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		]
	])

	protected GetStatusResistanceStacking(): [number, boolean] {
		return [this.cachedStatusResist, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedStatusResist = this.GetSpecialValue(
			"status_resistance",
			"tinker_defense_matrix"
		)
	}
}
