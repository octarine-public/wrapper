import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lina_fiery_soul extends Modifier {
	private cachedSpeed = 0
	private cachedAttackSpeed = 0

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

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed * this.StackCount, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed * this.StackCount, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "lina_fiery_soul"
		this.cachedSpeed = this.GetSpecialValue("fiery_soul_move_speed_bonus", name)
		this.cachedAttackSpeed = this.GetSpecialValue(
			"fiery_soul_attack_speed_bonus",
			name
		)
	}
}
