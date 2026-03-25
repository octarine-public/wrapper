import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_consecrated_wraps_speed_buff extends Modifier {
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue(
			"movement_speed_pct_on_stack_gain",
			"item_consecrated_wraps"
		)
	}
}
