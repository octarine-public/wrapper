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
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetIgnoreMoveSpeedLimit(): [number, boolean] {
		return [1, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.StackCount, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "spirit_breaker_bull_rush"
		this.GetSpecialValue("hero_movespeed_percent", name)
		this.GetSpecialValue("creep_movespeed_percent", name)
	}
}
