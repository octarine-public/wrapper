import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_seer_stone extends Modifier {
	private cachedVision = 0
	private cachedCastRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_DAY_VISION,
			this.GetBonusDayVision.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION,
			this.GetBonusNightVision.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_STACKING,
			this.GetCastRangeBonusStacking.bind(this)
		]
	])

	protected GetBonusNightVision(): [number, boolean] {
		return [this.cachedVision, false]
	}

	protected GetBonusDayVision(): [number, boolean] {
		return [this.cachedVision, false]
	}

	protected GetCastRangeBonusStacking(): [number, boolean] {
		return [this.cachedCastRange, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "item_seer_stone"
		this.cachedVision = this.GetSpecialValue("vision_bonus", name)
		this.cachedCastRange = this.GetSpecialValue("cast_range_bonus", name)
	}
}
