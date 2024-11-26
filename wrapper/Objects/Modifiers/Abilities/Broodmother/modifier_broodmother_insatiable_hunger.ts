import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_broodmother_insatiable_hunger extends Modifier {
	private cachedAdjustBAT = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT_ADJUST,
			this.GetBaseAttackTimeConstantAdjust.bind(this)
		]
	])

	protected GetBaseAttackTimeConstantAdjust(): [number, boolean] {
		return [this.cachedAdjustBAT, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAdjustBAT = this.GetSpecialValue(
			"bat_bonus",
			"broodmother_insatiable_hunger"
		)
	}
}
