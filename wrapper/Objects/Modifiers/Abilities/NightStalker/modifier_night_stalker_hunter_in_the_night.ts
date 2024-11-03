import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { GameRules } from "../../../Base/Entity"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_night_stalker_hunter_in_the_night extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		if (GameRules === undefined) {
			return [0, false]
		}
		return [this.cachedSpeed, !GameRules.IsNight]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue(
			"bonus_movement_speed_pct_night",
			"night_stalker_hunter_in_the_night"
		)
	}
}
