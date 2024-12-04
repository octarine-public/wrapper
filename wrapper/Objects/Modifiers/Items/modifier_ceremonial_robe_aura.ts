import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ceremonial_robe_aura extends Modifier {
	private cachedStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		]
	])

	protected GetStatusResistanceStacking(): [number, boolean] {
		return [-this.cachedStatusResist, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedStatusResist = this.GetSpecialValue(
			"status_resistance",
			"item_ceremonial_robe"
		)
	}
}
