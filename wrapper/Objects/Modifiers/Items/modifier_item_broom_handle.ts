import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_broom_handle extends Modifier {
	private cachedRange = 0
	private cachedArmor = 0
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_UNIQUE,
			this.GetAttackRangeBonusUnique.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamage, false]
	}

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}

	protected GetAttackRangeBonusUnique(): [number, boolean] {
		return this.HasMeleeAttacksBonuses() ? [this.cachedRange, false] : [0, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_broom_handle"
		this.cachedArmor = this.GetSpecialValue("bonus_armor", name)
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedRange = this.GetSpecialValue("melee_attack_range", name)
	}
}
