import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_nemesis_curse extends Modifier {
	private cachedDamage = 0
	private cachedIncDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamage, false]
	}

	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [this.cachedIncDamage, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "item_nemesis_curse"
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedIncDamage = this.GetSpecialValue("debuff_self", name)
	}
}
