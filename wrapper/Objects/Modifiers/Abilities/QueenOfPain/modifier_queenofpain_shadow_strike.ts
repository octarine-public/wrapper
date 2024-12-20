import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { GameState } from "../../../../Utils/GameState"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_queenofpain_shadow_strike extends Modifier {
	private readonly slowInterval = 1
	private readonly slowStep = 0.985
	private readonly slowStepStep = 0.815

	private cachedSpeed = 0
	private cachedSpeedValue = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const elapsed = this.ElapsedTime,
			dt = GameState.TickInterval

		const intervals = Math.max(Math.floor((elapsed - dt) / this.slowInterval), 0),
			slowStepFactor = Math.pow(this.slowStepStep, intervals),
			slowMultiplier = Math.pow(this.slowStep, ((intervals - 1) * intervals) / 2),
			eff = slowStepFactor * slowMultiplier

		this.cachedSpeed = this.cachedSpeedValue * eff
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		this.cachedSpeedValue = this.GetSpecialValue(
			"movement_slow",
			"queenofpain_shadow_strike"
		)
	}
}
