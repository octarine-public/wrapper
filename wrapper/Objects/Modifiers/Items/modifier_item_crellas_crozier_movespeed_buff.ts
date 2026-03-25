import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_crellas_crozier_movespeed_buff extends Modifier {
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed * this.StackCount, false]
	}
	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue(
			"movespeed_steal_pct",
			"item_crellas_crozier"
		)
	}
}
