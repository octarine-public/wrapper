import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bane_enfeeble_effect extends Modifier {
	private cachedCastRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_PERCENTAGE,
			this.GetCastRangeBonusPercentage.bind(this)
		]
	])

	protected GetCastRangeBonusPercentage(): [number, boolean] {
		return [-this.cachedCastRange, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedCastRange = this.GetSpecialValue("cast_reduction", "bane_enfeeble")
	}
}
