import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lycan_howl extends Modifier {
	private cachedArmor = 0
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [-this.cachedArmor, this.IsMagicImmune()]
	}

	protected GetPreAttackBonusDamagePercentage(): [number, boolean] {
		return [-this.cachedDamage, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "lycan_howl"
		this.cachedArmor = this.GetSpecialValue("armor", name)
		this.cachedDamage = this.GetSpecialValue("attack_damage_reduction", name)
	}
}
