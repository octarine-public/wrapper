import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_phase_boots_active extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedRangeSpeed = 0
	private cachedMeleeSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const value = this.HasMeleeAttacksBonuses()
			? this.cachedMeleeSpeed
			: this.cachedRangeSpeed
		return [value, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_phase_boots"
		this.cachedMeleeSpeed = this.GetSpecialValue("phase_movement_speed", name)
		this.cachedRangeSpeed = this.GetSpecialValue("phase_movement_speed_range", name)
	}
}
