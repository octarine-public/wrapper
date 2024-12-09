import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_crystal_maiden_frozen_expanse extends Modifier {
	private cachedAoeRadius = 0
	private cachedCastRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_PERCENTAGE,
			this.GetAoeBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_STACKING,
			this.GetCastRangeBonusStacking.bind(this)
		]
	])

	protected GetAoeBonusPercentage(): [number, boolean] {
		return [100 + this.cachedAoeRadius, false]
	}

	protected GetCastRangeBonusStacking(): [number, boolean] {
		return [this.cachedCastRange, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "crystal_maiden_freezing_field"
		this.cachedAoeRadius = this.GetSpecialValue("aoe_bonus", name)
		this.cachedCastRange = this.GetSpecialValue("self_cast_range_bonus", name)
	}
}
