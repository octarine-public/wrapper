import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mirana_solar_flare extends Modifier {
	// private cachedDayMult = 0

	protected readonly DeclaredFunction = new Map([
		// [
		// 	EModifierfunction.MODIFIER_PROPERTY_BONUS_DAY_VISION,
		// 	this.GetBonusDayVision.bind(this)
		// ],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	// protected GetBonusDayVision(): [number, boolean] {
	// 	return [this.StackCount * this.cachedDayMult, false]
	// }

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.StackCount, false]
	}

	// protected UpdateSpecialValues(): void {
	// 	this.cachedDayMult = this.GetSpecialValue(
	// 		"day_vision_multiplier",
	// 		"mirana_solar_flare"
	// 	)
	// }
}
