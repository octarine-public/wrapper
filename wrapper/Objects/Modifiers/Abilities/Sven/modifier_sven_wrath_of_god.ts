import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sven_wrath_of_god extends Modifier {
	private cachedBonusDamagePerStr = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	protected GetPreAttackBonusDamage(): [number, boolean] {
		const damage = this.cachedBonusDamagePerStr * (this.Parent?.TotalStrength ?? 0)
		return [damage, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedBonusDamagePerStr = this.GetSpecialValue(
			"bonus_damage_per_str",
			"sven_wrath_of_god"
		)
	}
}
