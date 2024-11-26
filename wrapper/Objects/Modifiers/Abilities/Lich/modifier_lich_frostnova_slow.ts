import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lich_frostnova_slow extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedAttackSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, this.IsMagicImmune()]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "lich_frost_nova"
		this.cachedSpeed = this.GetSpecialValue("slow_movement_speed", name)
		this.cachedAttackSpeed = this.GetSpecialValue("slow_attack_speed_primary", name)
	}
}
