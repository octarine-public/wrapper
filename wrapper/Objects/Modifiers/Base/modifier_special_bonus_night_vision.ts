import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_night_vision extends Modifier {
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
			"value",
			this.CachedAbilityName ?? ""
		)
	}
}
