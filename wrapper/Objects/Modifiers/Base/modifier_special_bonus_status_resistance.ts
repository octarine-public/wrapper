import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_status_resistance extends Modifier {
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
			"value",
			this.CachedAbilityName ?? ""
		)
	}
}
