import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ringmaster_impalement_bleed extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedSlowDuration = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
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
