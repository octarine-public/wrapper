import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { GameRules } from "../../../Base/Entity"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_night_stalker_hunter_in_the_night extends Modifier {
	private cachedSpeed = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const state = GameRules?.IsNight ?? false
		return [this.cachedSpeed, !state]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		const state = GameRules?.IsNight ?? false
		return [this.cachedAttackSpeed, !state]
	}

	protected UpdateSpecialValues(): void {
		const name = "night_stalker_hunter_in_the_night"
		this.cachedSpeed = this.GetSpecialValue("bonus_movement_speed_pct_night", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed_night", name)
	}
}
