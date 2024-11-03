import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_solar_crest_armor_addition extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.Parent !== this.Caster ? this.cachedSpeed : 0, false]
	}

	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue(
			"target_movement_speed",
			"item_solar_crest"
		)
	}
}
