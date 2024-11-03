import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_yasha extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE,
			this.GetMoveSpeedBonusPercentageUnique.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusPercentageUnique(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue(
			"movement_speed_percent_bonus",
			"item_yasha"
		)
	}
}
