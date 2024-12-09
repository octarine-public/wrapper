import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rubick_arcane_supremacy extends Modifier {
	private cachedCastRange = 0
	private cachedAOERadius = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_STACKING,
			this.GetCastRangeBonusStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_CONSTANT_STACKING,
			this.GetAoeBonusConstantStacking.bind(this)
		]
	])

	protected GetCastRangeBonusStacking(): [number, boolean] {
		return [this.cachedCastRange, false]
	}

	protected GetAoeBonusConstantStacking(): [number, boolean] {
		return [this.cachedAOERadius * this.StackCount, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "rubick_arcane_supremacy"
		this.cachedAOERadius = this.GetSpecialValue("aoe_bonus", name)
		this.cachedCastRange = this.GetSpecialValue("cast_range", name)
	}
}
