import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_sange_and_yasha extends Modifier {
	private cachedSpeed = 0
	private cachedSpeedResist = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_UNIQUE,
			this.GetSlowResistanceUnique.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE,
			this.GetMoveSpeedBonusPercentageUnique.bind(this)
		]
	])

	protected GetSlowResistanceUnique(): [number, boolean] {
		return [this.cachedSpeedResist, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected GetMoveSpeedBonusPercentageUnique(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_sange_and_yasha"
		this.cachedSpeed = this.GetSpecialValue("movement_speed_percent_bonus", name)
		this.cachedSpeedResist = this.GetSpecialValue("slow_resistance", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
	}
}
