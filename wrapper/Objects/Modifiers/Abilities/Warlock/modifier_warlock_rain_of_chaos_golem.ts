import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_warlock_rain_of_chaos_golem extends Modifier {
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

	protected UpdateSpecialValues(): void {
		this.cachedSlowResist = this.GetSpecialValue(
			"bonus_slow_resistance",
			"warlock_rain_of_chaos"
		)
	}
}
