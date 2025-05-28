import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_brawny extends Modifier {
	private cachedSpeedResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_UNIQUE,
			this.GetSlowResistanceUnique.bind(this)
		]
	])
	protected GetSlowResistanceUnique(): [number, boolean] {
		return [this.cachedSpeedResist, false]
	}
	protected UpdateSpecialValues() {
		this.cachedSpeedResist = this.GetSpecialValue(
			"slow_resist",
			"item_enhancement_brawny"
		)
	}
}
