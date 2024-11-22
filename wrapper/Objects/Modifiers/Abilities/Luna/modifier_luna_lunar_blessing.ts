import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_luna_lunar_blessing extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION,
			this.GetBonusNightVision.bind(this)
		]
	])

	private cachedVision = 0
	private cachedVisionPerLevel = 0

	protected GetBonusNightVision(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		const bonusPerLevel = this.cachedVisionPerLevel * owner.Level
		return [this.cachedVision + bonusPerLevel, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "luna_lunar_blessing"
		this.cachedVision = this.GetSpecialValue("bonus_night_vision_self", name)
		this.cachedVisionPerLevel = this.GetSpecialValue(
			"bonus_night_vision_per_level",
			name
		)
	}
}
