import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_eye_of_the_vizier extends Modifier {
	private cachedCastRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_STACKING,
			this.GetCastRangeBonusStacking.bind(this)
		]
	])

	protected GetCastRangeBonusStacking(): [number, boolean] {
		return [this.cachedCastRange, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedCastRange = this.GetSpecialValue(
			"cast_range_bonus",
			"item_eye_of_the_vizier"
		)
	}
}
