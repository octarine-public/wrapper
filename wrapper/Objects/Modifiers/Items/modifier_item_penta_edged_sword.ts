import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_penta_edged_sword extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_UNIQUE,
			this.GetAttackRangeBonusUnique.bind(this)
		]
	])

	private cachedRange = 0

	protected GetAttackRangeBonusUnique(): [number, boolean] {
		return this.HasMeleeAttacksBonuses() ? [this.cachedRange, false] : [0, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedRange = this.GetSpecialValue(
			"melee_attack_range",
			"item_penta_edged_sword"
		)
	}
}
