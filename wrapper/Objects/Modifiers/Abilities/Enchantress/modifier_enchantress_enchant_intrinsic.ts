import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_enchantress_enchant_intrinsic extends Modifier {
	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	private cachedRange = 0
	private cachedRangeValue = 0

	public PostDataUpdate(): void {
		const caster = this.Caster
		if (caster === undefined || caster.Target === undefined) {
			this.cachedRange = 0
			return
		}
		const hasSlow = caster.Target.HasBuffByName("modifier_enchantress_enchant_slow")
		if (!caster.IsAttacking || !hasSlow) {
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
			"enchantress_enchant"
		)
	}
}
