import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_spirit_breaker_bull_rush extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

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
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetIgnoreMoveSpeedLimit(): [number, boolean] {
		return [1, false]
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		const elapsed = this.ElapsedTime,
			maxDuration = this.Duration,
			speed = this.NetworkArmor
		return [Math.remapRange(elapsed, 0, maxDuration, speed, 0), false]
	}
}
