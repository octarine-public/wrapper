import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_dormant_curio_permanent extends Modifier {
	protected readonly CachedAbilityName = "item_dormant_curio"

	private cachedIncreaseValue = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CURIO_MULTIPLIER_BONUS_CONSTANT,
			this.GetCurioMultiplierBonusConstant.bind(this)
		]
	])

	protected GetCurioMultiplierBonusConstant(): [number, boolean] {
		return [this.cachedIncreaseValue, false]
	}

	protected UpdateSpecialValues() {
		this.cachedIncreaseValue = this.GetSpecialValue(
			"item_potency",
			this.CachedAbilityName,
			1
		)
	}
}
