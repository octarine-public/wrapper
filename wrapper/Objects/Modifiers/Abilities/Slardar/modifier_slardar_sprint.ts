import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slardar_sprint extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private slowResist = 0
	private bonusSpeed = 0
	private bonusBurst = 0

	private burstDuration = 0
	private maxBurstDuration = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const eff = Math.remapRange(
			this.ElapsedTime,
			this.maxBurstDuration,
			this.burstDuration,
			1,
			0
		)
		return [this.bonusSpeed + this.bonusBurst * eff, false]
	}

	protected GetSlowResistanceStacking(): [number, boolean] {
		const eff = Math.remapRange(
			this.ElapsedTime,
			this.maxBurstDuration,
			this.burstDuration,
			1,
			0
		)
		return [this.slowResist * eff, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "slardar_sprint"
		this.bonusSpeed = this.GetSpecialValue("bonus_speed", name)
		this.bonusBurst = this.GetSpecialValue("speed_burst_percent", name)
		this.slowResist = this.GetSpecialValue("slow_resistance_tooltip", name)
		this.burstDuration = this.GetSpecialValue("speed_burst_duration", name)
		this.maxBurstDuration = this.GetSpecialValue("speed_burst_max_duration", name)
	}
}
