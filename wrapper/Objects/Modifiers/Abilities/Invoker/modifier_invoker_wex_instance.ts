import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invoker_wex_instance extends Modifier {
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedSpeed = 0
			return
		}
		const name = "invoker_wex"
		this.cachedSpeed = this.GetSpecialValue("move_speed_per_instance", name)

		const multiplier = owner.GetAbilityByName("special_bonus_unique_invoker_13")
		if ((multiplier?.Level ?? 0) !== 0) {
			this.cachedSpeed *= 2
		}
	}
}
