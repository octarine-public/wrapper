import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_arc_warden_flux extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedTempestSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const value = this.cachedSpeed || this.cachedTempestSpeed
		return [-value, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue("move_speed_slow_pct", "arc_warden_flux")
		this.cachedTempestSpeed = this.GetSpecialValue(
			"tempest_move_speed_slow_pct",
			"arc_warden_flux"
		)
	}
}