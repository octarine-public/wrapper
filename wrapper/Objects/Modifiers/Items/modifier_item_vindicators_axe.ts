import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_vindicators_axe extends Modifier {
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

	protected UpdateSpecialValues() {
		this.cachedSpeedResist = this.GetSpecialValue(
			"bonus_slow_resist",
			"item_vindicators_axe"
		)
	}
}
