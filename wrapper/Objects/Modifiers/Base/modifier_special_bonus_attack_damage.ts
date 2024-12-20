import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_attack_damage extends Modifier {
	private cachedAttackDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedAttackDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAttackDamage = this.GetSpecialValue(
			"value",
			this.CachedAbilityName ?? ""
		)
	}
}
