import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_keen_eyed extends Modifier {
	private cachedCastRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS,
			this.GetCastRangeBonus.bind(this)
		]
	])
	protected GetCastRangeBonus(): [number, boolean] {
		return [this.cachedCastRange, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedCastRange = this.GetSpecialValue(
			"cast_range_bonus",
			"item_enhancement_keen_eyed"
		)
	}
}
