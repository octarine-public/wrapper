import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slardar_seaborn_sentinel_river extends Modifier {
	private cachedSpeed = 0
	private cachedArmor = 0
	private cachedBonusDamage = 0
	private cachedStatusResist = 0

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
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, this.IsPassiveDisabled()]
	}

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedBonusDamage, this.IsPassiveDisabled()]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, this.IsPassiveDisabled()]
	}

	protected GetStatusResistanceStacking(): [number, boolean] {
		return [this.cachedStatusResist, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		const name = "slardar_seaborn_sentinel"
		this.cachedSpeed = this.GetSpecialValue("river_speed", name)
		this.cachedArmor = this.GetSpecialValue("puddle_armor", name)
		this.cachedBonusDamage = this.GetSpecialValue("river_damage", name)
		this.cachedStatusResist = this.GetSpecialValue("puddle_status_resistance", name)
	}
}
