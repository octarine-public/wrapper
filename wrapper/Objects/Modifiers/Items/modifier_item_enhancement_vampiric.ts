import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_vampiric extends Modifier {
	private cachedNightVision = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION,
			this.GetBonusNightVision.bind(this)
		]
	])
	protected GetBonusNightVision(): [number, boolean] {
		return [this.cachedNightVision, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedNightVision = this.GetSpecialValue(
			"bonus_night_vision",
			"item_enhancement_vampiric"
		)
	}
}
