import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_life_stealer_infest_effect extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined || owner.IsCreep) {
			return [0, false]
		}
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue(
			"bonus_movement_speed",
			"life_stealer_infest"
		)
	}
}
