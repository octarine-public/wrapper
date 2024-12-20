import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_jakiro_double_trouble extends Modifier {
	private cachedDamageReduction = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])

	protected GetPreAttackBonusDamagePercentage(): [number, boolean] {
		return [-this.cachedDamageReduction, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamageReduction = this.GetSpecialValue(
			"attack_damage_reduction",
			"jakiro_double_trouble"
		)
	}
}
