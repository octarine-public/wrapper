import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dawnbreaker_fire_wreath_caster extends Modifier {
	private cachedSpeedMin = 0
	private cachedSpeedPenalty = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DISABLE_TURNING,
			this.GetDisableTurning.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN,
			this.GetMoveSpeedAbsoluteMin.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	protected GetDisableTurning(): [number, boolean] {
		return [1, false]
	}

	protected GetMoveSpeedAbsoluteMin(): [number, boolean] {
		return [this.cachedSpeedMin, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedSpeedPenalty, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "dawnbreaker_fire_wreath"
		this.cachedSpeedMin = this.GetSpecialValue("movement_speed", name)
		this.cachedSpeedPenalty = this.GetSpecialValue("shard_movement_penalty", name)
	}
}
