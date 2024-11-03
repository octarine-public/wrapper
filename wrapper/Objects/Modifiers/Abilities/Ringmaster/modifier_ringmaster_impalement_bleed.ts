import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ringmaster_impalement_bleed extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedSlowDuration = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const slowDuration = this.cachedSlowDuration
		const remainingTime = this.RemainingTime
		return remainingTime <= this.Duration - slowDuration
			? [0, false]
			: [-this.cachedSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		const name = "ringmaster_impalement_bleed"
		this.cachedSpeed = this.GetSpecialValue("slow_percent", name)
		this.cachedSlowDuration = this.GetSpecialValue("slow_duration", name)
	}
}
