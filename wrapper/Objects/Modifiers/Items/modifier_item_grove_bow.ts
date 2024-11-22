import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_grove_bow extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	private cachedRange = 0

	protected GetAttackRangeBonus(): [number, boolean] {
		return [(this.Parent?.IsRanged ?? false) ? this.cachedRange : 0, false]
	}

	protected UpdateSpecialValues() {
		this.cachedRange = this.GetSpecialValue("attack_range_bonus", "item_grove_bow")
	}
}
