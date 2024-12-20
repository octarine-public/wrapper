import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_mysterious_hat extends Modifier {
	private cachedSpellAmplify = 0
	private cachedManaCostStacking = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING,
			this.GetManaCostPercentageStacking.bind(this)
		]
	])

	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return [this.cachedSpellAmplify, false]
	}

	protected GetManaCostPercentageStacking(): [number, boolean] {
		return [this.cachedManaCostStacking, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_mysterious_hat"
		this.cachedSpellAmplify = this.GetSpecialValue("spell_amp", name)
		this.cachedManaCostStacking = this.GetSpecialValue("manacost_reduction", name)
	}
}
