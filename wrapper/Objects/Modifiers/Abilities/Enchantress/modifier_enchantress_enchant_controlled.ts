import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_enchantress_enchant_controlled extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackDamageBonus.bind(this)
		]
	])
	protected GetPreAttackDamageBonus(): [number, boolean] {
		return [this.cachedDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue("enchant_damage", "enchantress_enchant")
	}
}
