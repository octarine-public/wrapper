import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_wisp_overcharge extends Modifier {
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
			"shard_bonus_slow_resistance",
			"wisp_overcharge"
		)
	}
}
