import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invoker_wex_instance extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedSpeed = 0
			return
		}
		const multiplier = owner.GetAbilityByName("special_bonus_unique_invoker_13")
		this.cachedSpeed = this.GetSpecialValue("move_speed_per_instance", "invoker_wex")
		if ((multiplier?.Level ?? 0) !== 0) {
			this.cachedSpeed *= 2
		}
	}
}
