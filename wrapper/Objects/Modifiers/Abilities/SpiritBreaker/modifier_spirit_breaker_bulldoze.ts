import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_spirit_breaker_bulldoze extends Modifier {
	private cachedSpeed = 0
	private cachedStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		]
	])

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected GetStatusResistanceStacking(): [number, boolean] {
		return [this.cachedStatusResist, false]
	}

	protected UpdateSpecialValues(): void {
		this.HasVisualShield = this.NetworkFadeTime !== 0

		const name = "spirit_breaker_bulldoze"
		this.cachedSpeed = this.GetSpecialValue("movement_speed", name)
		this.cachedStatusResist = this.GetSpecialValue("status_resistance", name)
	}
}
