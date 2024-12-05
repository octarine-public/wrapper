import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_batrider_sticky_napalm extends Modifier {
	private cachedSpeed = 0
	private cachedTurnRate = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TURN_RATE_PERCENTAGE,
			this.GetTurnRatePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	protected GetTurnRatePercentage(): [number, boolean] {
		return [this.cachedTurnRate, this.IsMagicImmune()]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed * this.StackCount, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "batrider_sticky_napalm"
		this.cachedSpeed = this.GetSpecialValue("movement_speed_pct", name)
		this.cachedTurnRate = this.GetSpecialValue("turn_rate_pct", name)
	}
}
