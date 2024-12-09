import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_broodmother_spin_web extends Modifier {
	private cachedSpeed = 0
	private cachedTurnRateConstant = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TURN_RATE_CONSTANT,
			this.GetTurnRateConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	protected GetTurnRateConstant(): [number, boolean] {
		return [this.cachedTurnRateConstant, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "broodmother_spin_web"
		this.cachedSpeed = this.GetSpecialValue("bonus_movespeed", name)
		this.cachedTurnRateConstant = this.GetSpecialValue("bonus_turn_rate", name)
	}
}
