import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sven_gods_strength extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		]
	])

	private cachedSpeedResist = 0

	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSpeedResist, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeedResist = this.GetSpecialValue(
			"bonus_slow_resistance",
			"sven_gods_strength"
		)
	}
}
