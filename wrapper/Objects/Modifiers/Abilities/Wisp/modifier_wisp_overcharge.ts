import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_wisp_overcharge extends Modifier {
	private cachedArmor = 0
	private cachedSpeedResist = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
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
		return [this.cachedArmor, false]
	}

	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSpeedResist, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "wisp_overcharge"
		this.cachedArmor = this.GetSpecialValue("bonus_armor", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
		this.cachedSpeedResist = this.GetSpecialValue("shard_bonus_slow_resistance", name)
	}
}
