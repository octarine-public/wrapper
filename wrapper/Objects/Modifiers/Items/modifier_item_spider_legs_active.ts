import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_spider_legs_active extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

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
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetTurnRatePercentage(): [number, boolean] {
		return [this.cachedTurnRate, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected UpdateSpecialValues() {
		const name = "item_spider_legs"
		this.cachedSpeed = this.GetSpecialValue("bonus_movement_speed_active", name)
		this.cachedTurnRate = this.GetSpecialValue("turn_rate", name)
	}
}
