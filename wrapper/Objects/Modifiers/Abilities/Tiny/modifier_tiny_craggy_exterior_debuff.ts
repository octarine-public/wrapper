import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tiny_craggy_exterior_debuff extends Modifier {
	private cachedDamagePerStack = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])

	protected GetPreAttackBonusDamagePercentage(): [number, boolean] {
		return [-(this.cachedDamagePerStack * this.StackCount), this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamagePerStack = this.GetSpecialValue(
			"damage_reduction_per_stack",
			"tiny_craggy_exterior"
		)
	}
}
