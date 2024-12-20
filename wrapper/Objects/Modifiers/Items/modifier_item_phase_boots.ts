import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_phase_boots extends Modifier {
	private cachedArmor = 0
	private cachedSpeed = 0
	private cachedDamageMelee = 0
	private cachedDamageRanged = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE,
			this.GetMoveSpeedBonusUnique.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}

	protected GetPreAttackBonusDamage(): [number, boolean] {
		const value = this.HasMeleeAttacksBonuses()
			? this.cachedDamageMelee
			: this.cachedDamageRanged
		return [value, false]
	}

	protected GetMoveSpeedBonusUnique(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_phase_boots"
		this.cachedArmor = this.GetSpecialValue("bonus_armor", name)
		this.cachedSpeed = this.GetSpecialValue("bonus_movement_speed", name)
		this.cachedDamageMelee = this.GetSpecialValue("bonus_damage_melee", name)
		this.cachedDamageRanged = this.GetSpecialValue("bonus_damage_range", name)
	}
}
