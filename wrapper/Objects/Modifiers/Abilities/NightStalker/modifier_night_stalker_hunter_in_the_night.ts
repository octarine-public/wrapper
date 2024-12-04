import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { GameRules } from "../../../Base/Entity"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_night_stalker_hunter_in_the_night extends Modifier {
	private cachedSpeed = 0
	private cachedAttackSpeed = 0
	private cachedStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		]
	])

	private get isValidFlag() {
		const isNight = GameRules?.IsNight ?? false
		return isNight && !this.IsPassiveDisabled()
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, !this.isValidFlag]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, !this.isValidFlag]
	}

	protected GetStatusResistanceStacking(): [number, boolean] {
		return [this.cachedStatusResist, !this.isValidFlag]
	}

	protected UpdateSpecialValues(): void {
		const name = "night_stalker_hunter_in_the_night"
		this.cachedSpeed = this.GetSpecialValue("bonus_movement_speed_pct_night", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed_night", name)
		this.cachedStatusResist = this.GetSpecialValue("bonus_status_resist_night", name)
	}
}
