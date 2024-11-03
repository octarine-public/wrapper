import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_snapfire_scatterblast_slow extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedSpeedBonus = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		let value = this.cachedSpeed
		if (this.NetworkIsActive) {
			value += this.cachedSpeedBonus
		}
		return [-value, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "snapfire_scatterblast"
		this.cachedSpeed = this.GetSpecialValue("movement_slow_pct", name)
		this.cachedSpeedBonus = this.GetSpecialValue("point_blank_dmg_bonus_pct", name)
	}
}
