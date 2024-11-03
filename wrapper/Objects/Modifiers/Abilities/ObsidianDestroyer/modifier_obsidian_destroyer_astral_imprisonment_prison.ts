import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_obsidian_destroyer_astral_imprisonment_prison extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed - 100, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue(
			"allied_movement_speed_pct",
			"obsidian_destroyer_astral_imprisonment"
		)
	}
}
