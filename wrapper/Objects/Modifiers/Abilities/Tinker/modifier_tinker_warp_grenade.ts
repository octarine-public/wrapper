import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tinker_warp_grenade extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_PERCENTAGE,
			this.GetAttackRangeBonusPercentage.bind(this)
		]
	])

	private cachedRange = 0

	protected GetAttackRangeBonusPercentage(): [number, boolean] {
		return [-this.cachedRange, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedRange = this.GetSpecialValue("range_reduction", "tinker_warp_grenade")
	}
}
