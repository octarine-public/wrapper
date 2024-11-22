import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_weaver_rewoven extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	private cachedRangePerStack = 0

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRangePerStack * this.StackCount, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedRangePerStack = this.GetSpecialValue(
			"attack_range_increase_per_stack",
			"weaver_rewoven"
		)
	}
}
