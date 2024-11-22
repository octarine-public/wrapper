import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_seer_stone extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_DAY_VISION,
			this.GetBonusDayVision.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION,
			this.GetBonusNightVision.bind(this)
		]
	])

	private cachedVision = 0

	protected GetBonusNightVision(): [number, boolean] {
		return [this.cachedVision, false]
	}

	protected GetBonusDayVision(): [number, boolean] {
		return [this.cachedVision, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedVision = this.GetSpecialValue("vision_bonus", "item_seer_stone")
	}
}
