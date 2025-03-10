import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_dazzle_poison_touch_self extends Modifier {
	private cachedRange = 0
	private cachedRangeValue = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	public PostDataUpdate(): void {
		if (this.cachedRangeValue === 0) {
			return
		}
		const owner = this.Parent
		if (owner === undefined || !(owner.Target instanceof Unit)) {
			this.cachedRange = 0
			return
		}
		const hasPoison = owner.Target.HasBuffByName("modifier_dazzle_poison_touch")
		if (!owner.IsAttacking || !hasPoison) {
			this.cachedRange = 0
			return
		}
		this.cachedRange = this.cachedRangeValue
	}

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedRangeValue = this.GetSpecialValue(
			"attack_range_bonus",
			"dazzle_poison_touch"
		)
	}
}
