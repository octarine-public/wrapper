import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_storm_spirit_overload_debuff extends Modifier {
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
		return [this.cachedSpeed, this.IsMagicImmune()]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		const name = "storm_spirit_overload"
		this.cachedSpeed = this.GetSpecialValue("overload_move_slow", name)
		this.cachedAttackSpeed = this.GetSpecialValue("overload_attack_slow", name)
	}
}
