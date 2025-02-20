import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_abyssal_blade extends Modifier {
	private cachedSlowResist = 0
	private cachedAttackDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSlowResist, false]
	}
	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedAttackDamage, false]
	}
	protected UpdateSpecialValues() {
		const name = "item_abyssal_blade"
		this.cachedAttackDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedSlowResist = this.GetSpecialValue("slow_resistance", name)
	}
}
