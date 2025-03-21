import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_drow_ranger_glacier_hilltop extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	private cachedRange = 0

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedRange = this.GetSpecialValue(
			"attack_range_bonus",
			"drow_ranger_glacier"
		)
	}
}
