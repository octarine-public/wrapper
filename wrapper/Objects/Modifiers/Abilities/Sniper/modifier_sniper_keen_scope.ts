import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sniper_keen_scope extends Modifier {
	private cachedRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedRange = this.GetSpecialValue("bonus_range", "sniper_keen_scope")
	}
}
