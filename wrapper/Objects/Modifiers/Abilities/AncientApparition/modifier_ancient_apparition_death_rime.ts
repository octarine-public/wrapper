import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ancient_apparition_death_rime extends Modifier {
	private cachedSpeed = 0
	// private cachedCastTime = 0

	protected readonly DeclaredFunction = new Map([
		// [
		// 	EModifierfunction.MODIFIER_PROPERTY_CASTTIME_PERCENTAGE,
		// 	this.GetCastTimePercentage.bind(this)
		// ],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	// protected GetCastTimePercentage(): [number, boolean] {
	// 	return [-this.cachedCastTime, this.IsMagicImmune()]
	// }

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-(this.cachedSpeed * this.StackCount), this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "ancient_apparition_death_rime"
		this.cachedSpeed = this.GetSpecialValue("slow", name)
		// this.cachedCastTime = this.GetSpecialValue("cast_slow", name)
	}
}
