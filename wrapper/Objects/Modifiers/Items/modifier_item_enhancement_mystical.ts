import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_mystical extends Modifier {
	private cachedMres = 0
	private cachedManaCostReduction = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING,
			this.GetManaCostPercentageStacking.bind(this)
		]
	])
	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, false]
	}
	protected GetManaCostPercentageStacking(): [number, boolean] {
		return [this.cachedManaCostReduction, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_enhancement_mystical"
		this.cachedMres = this.GetSpecialValue("magic_res", name)
		this.cachedManaCostReduction = this.GetSpecialValue("manacost_reduction", name)
	}
}
