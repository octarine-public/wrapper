import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_venomancer_venomous_gale extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSlow = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const value = (this.RemainingTime / this.Duration) * this.cachedSlow
		return [value, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSlow = this.GetSpecialValue(
			"movement_slow",
			"venomancer_venomous_gale"
		)
	}
}
