import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_quelling_blade extends Modifier {
	private cachedDamageMelee = 0
	private cachedDamageRanged = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_TARGET,
			this.GetPreAttackBonusDamageTarget.bind(this)
		]
	])

	protected GetPreAttackBonusDamageTarget(): [number, boolean] {
		return [
			this.HasMeleeAttacksBonuses()
				? this.cachedDamageMelee
				: this.cachedDamageRanged,
			false
		]
	}

	protected UpdateSpecialValues() {
		const name = "item_quelling_blade"
		this.cachedDamageMelee = this.GetSpecialValue("damage_bonus", name)
		this.cachedDamageRanged = this.GetSpecialValue("damage_bonus_ranged", name)
	}
}
