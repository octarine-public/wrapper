import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_enhancement_tough extends Modifier {
	private cachedArmor = 0
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}
	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamage, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_enhancement_tough"
		this.cachedArmor = this.GetSpecialValue("armor", name)
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
	}
}
