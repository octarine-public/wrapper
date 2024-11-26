import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_warpath extends Modifier {
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

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed * this.StackCount, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed * this.StackCount, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "bristleback_warpath"
		this.cachedSpeed = this.GetSpecialValue("move_speed_per_stack", name)
		this.cachedAttackSpeed = this.GetSpecialValue("aspd_per_stack", name)
	}
}
