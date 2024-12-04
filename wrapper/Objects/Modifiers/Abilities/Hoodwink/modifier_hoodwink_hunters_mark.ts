import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_hoodwink_hunters_mark extends Modifier {
	private cachedSpeed = 0
	// private cachedStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
		// [
		// 	EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
		// 	this.GetStatusResistanceStacking.bind(this)
		// ]
	])

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedSpeed, this.IsMagicImmune()]
	}

	// protected GetStatusResistanceStacking(): [number, boolean] {
	// 	return [-this.cachedStatusResist, this.IsMagicImmune()]
	// }

	protected UpdateSpecialValues(): void {
		const name = "hoodwink_hunters_boomerang"
		this.cachedSpeed = this.GetSpecialValue("slow_pct", name)
		// this.cachedStatusResist = this.GetSpecialValue("status_resistance", name)
	}
}
