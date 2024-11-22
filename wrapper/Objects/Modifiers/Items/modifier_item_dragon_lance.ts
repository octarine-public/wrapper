import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_dragon_lance extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_UNIQUE,
			this.GetAttackRangeBonusUnique.bind(this)
		]
	])

	private cachedRange = 0

	protected GetAttackRangeBonusUnique(): [number, boolean] {
		return [(this.Parent?.IsRanged ?? false) ? this.cachedRange : 0, false]
	}

	protected UpdateSpecialValues() {
		this.cachedRange = this.GetSpecialValue("base_attack_range", "item_dragon_lance")
	}
}
