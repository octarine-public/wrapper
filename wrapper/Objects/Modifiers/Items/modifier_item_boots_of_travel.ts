import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_boots_of_travel extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE,
			this.GetMoveSpeedBonusUnique.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusUnique(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue(
			"bonus_movement_speed",
			"item_travel_boots"
		)
	}
}
