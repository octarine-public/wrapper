import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_terrorblade_reflection_slow extends Modifier {
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
		return [-this.cachedSpeed, this.IsMagicImmune()]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [-this.cachedAttackSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "terrorblade_reflection"
		this.cachedSpeed = this.GetSpecialValue("move_slow", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_slow", name)
	}
}
