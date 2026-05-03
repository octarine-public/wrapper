import { WrapperClassModifier } from "../../../../Decorators"
import { EDOTASpecialBonusOperation } from "../../../../Enums/EDOTASpecialBonusOperation"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_death_prophet_witchcraft extends Modifier {
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue(
			"movement_speed_pct",
			"death_prophet_witchcraft",
			Math.max(this.Ability?.Level ?? this.AbilityLevel, 1),
			{ lvlup: { operation: EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD } }
		)
	}
}
