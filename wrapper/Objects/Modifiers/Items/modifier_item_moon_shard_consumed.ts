import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_moon_shard_consumed extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION_UNIQUE,
			this.GetBonusNightVisionUnique.bind(this)
		]
	])

	private cachedNightVision = 0

	protected GetBonusNightVisionUnique(): [number, boolean] {
		return [this.cachedNightVision, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedNightVision = this.GetSpecialValue(
			"consumed_bonus_night_vision",
			"item_moon_shard"
		)
	}
}
