import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_vindicators_axe extends Modifier {
	private cachedArmor = 0
	private cachedDamage = 0
	private cachedAttackSpeed = 0
	private cachedSpeedResist = 0

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
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [(this.Parent?.IsStunned ?? false) ? this.cachedArmor : 0, false]
	}

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [(this.Parent?.IsSilenced ?? false) ? this.cachedDamage : 0, false]
	}

	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSpeedResist, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_vindicators_axe"
		this.cachedArmor = this.GetSpecialValue("bonus_armor", name)
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedSpeedResist = this.GetSpecialValue("bonus_slow_resist", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
	}
}
