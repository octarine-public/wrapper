import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_mysterious_hat extends Modifier {
	private cachedManaCostStacking = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING,
			this.GetManaCostPercentageStacking.bind(this)
		]
	])

	protected GetManaCostPercentageStacking(): [number, boolean] {
		return [this.cachedManaCostStacking, false]
	}

	protected UpdateSpecialValues() {
		this.cachedManaCostStacking = this.GetSpecialValue(
			"manacost_reduction",
			"item_mysterious_hat"
		)
	}
}
