import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_ascetic_cap_buff extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		]
	])

	private cachedSlowResist = 0

	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSlowResist, false]
	}

	protected UpdateSpecialValues() {
		this.cachedSlowResist = this.GetSpecialValue(
			"slow_resistance",
			"item_ascetic_cap"
		)
	}
}
