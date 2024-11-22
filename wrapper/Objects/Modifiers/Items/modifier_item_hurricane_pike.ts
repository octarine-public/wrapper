import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_hurricane_pike extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_UNIQUE,
			this.GetAttackRangeBonusUnique.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetAttackRangeBonusUnique(): [number, boolean] {
		return [(this.Parent?.IsRanged ?? false) ? this.cachedSpeed : 0, false]
	}

	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue(
			"base_attack_range",
			"item_hurricane_pike"
		)
	}
}
