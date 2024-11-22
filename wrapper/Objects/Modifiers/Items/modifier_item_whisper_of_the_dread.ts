import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_whisper_of_the_dread extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_DAY_VISION_PERCENTAGE,
			this.GetBonusDayVisionPercentage.bind(this)
		]
	])

	private cachedDayVision = 0

	protected GetBonusDayVisionPercentage(): [number, boolean] {
		return [-this.cachedDayVision, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDayVision = this.GetSpecialValue(
			"vision_penalty",
			"item_whisper_of_the_dread"
		)
	}
}
