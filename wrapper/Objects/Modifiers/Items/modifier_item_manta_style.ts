import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_manta_style extends Modifier {
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE,
			this.GetMoveSpeedBonusPercentageUnique.bind(this)
		]
	])

	protected GetMoveSpeedBonusPercentageUnique(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue("bonus_movement_speed", "item_manta")
	}
}
