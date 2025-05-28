import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_mystical extends Modifier {
	private cachedMres = 0
	private cachedCastRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS,
			this.GetCastRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])
	protected GetCastRangeBonus(): [number, boolean] {
		return [this.cachedCastRange, false]
	}
	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_enhancement_mystical"
		this.cachedMres = this.GetSpecialValue("magic_res", name)
		this.cachedCastRange = this.GetSpecialValue("bonus_cast_range", name)
	}
}
