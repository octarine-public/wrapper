import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_phantom_assassin_blur_active extends Modifier {
	private cachedSpeed = 0
	private cachedManaCostStacking = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING,
			this.GetManaCostPercentageStacking.bind(this)
		]
	])

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected GetManaCostPercentageStacking(): [number, boolean] {
		return [this.cachedManaCostStacking, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "phantom_assassin_blur"
		this.cachedSpeed = this.GetSpecialValue("active_movespeed_bonus", name)
		this.cachedManaCostStacking = this.GetSpecialValue(
			"manacost_reduction_during_blur_pct",
			name
		)
	}
}
