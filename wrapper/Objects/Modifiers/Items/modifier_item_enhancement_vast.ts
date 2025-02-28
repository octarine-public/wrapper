import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_vast extends Modifier {
	private cachedAttackRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])
	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedAttackRange, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedAttackRange = this.GetSpecialValue(
			"attack_range",
			"item_enhancement_vast"
		)
	}
}
