import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_mana_reduction extends Modifier {
	private cachedManaCostReduction = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING,
			this.GetManaCostPercentageStacking.bind(this)
		]
	])

	protected GetManaCostPercentageStacking(): [number, boolean] {
		return [this.cachedManaCostReduction, false]
	}

	protected UpdateSpecialValues() {
		this.cachedManaCostReduction = this.GetSpecialValue(
			"value",
			this.CachedAbilityName ?? ""
		)
	}
}
