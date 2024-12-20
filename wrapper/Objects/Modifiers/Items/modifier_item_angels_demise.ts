import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { modifier_item_phylactery } from "./modifier_item_phylactery"

@WrapperClassModifier()
export class modifier_item_angels_demise extends modifier_item_phylactery {
	private cachedPassiveDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedPassiveDamage, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_angels_demise"
		this.cachedPassiveDamage = this.GetSpecialValue("bonus_damage", name)
		this.CachedBonusDamage = this.GetSpecialValue("spell_crit_flat", name)
		this.CachedMultiplier = this.GetSpecialValue("spell_crit_multiplier", name)
	}
}
