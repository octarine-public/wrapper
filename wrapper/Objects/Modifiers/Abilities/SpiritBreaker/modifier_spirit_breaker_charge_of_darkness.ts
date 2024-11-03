import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_spirit_breaker_charge_of_darkness extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT,
			this.GetIgnoreMoveSpeedLimit.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])

	private speedMin = 0
	private speedMax = 0
	private windupTime = 0

	protected GetIgnoreMoveSpeedLimit(): [number, boolean] {
		return [1, false]
	}

	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		const elapsed = this.ElapsedTime,
			windTime = this.windupTime,
			minResult = (this.speedMin * this.speedMax) / 100
		return [Math.remapRange(elapsed, 0, windTime, minResult, this.speedMax), false]
	}

	protected UpdateSpecialValues(): void {
		const name = "spirit_breaker_charge_of_darkness"
		this.windupTime = this.GetSpecialValue("windup_time", name)
		this.speedMax = this.GetSpecialValue("movement_speed", name)
		this.speedMin = this.GetSpecialValue("min_movespeed_bonus_pct", name)
	}
}
