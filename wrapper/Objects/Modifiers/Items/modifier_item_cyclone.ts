import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_cyclone extends Modifier {
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])

	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue("bonus_movement_speed", "item_cyclone")
	}
}
