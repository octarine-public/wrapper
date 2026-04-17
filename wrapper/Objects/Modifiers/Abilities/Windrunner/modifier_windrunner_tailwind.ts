import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_windrunner_tailwind extends Modifier {
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const elapsed = this.ElapsedTime,
			maxDuration = this.Duration,
			halfDuration = maxDuration / 2,
			speed = this.cachedSpeed
		if (elapsed >= halfDuration) {
			return [Math.remapRange(elapsed, halfDuration, maxDuration, speed, 0), false]
		}
		return [speed, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue("movespeed_bonus", "windrunner_tailwind")
	}
}
