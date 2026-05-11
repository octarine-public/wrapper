import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { GameRules } from "../../../Base/Entity"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dawnbreaker_break_of_dawn extends Modifier {
	private cachedMaxVisionPct = 0
	private cachedMaxDamagePct = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_DAY_VISION_PERCENTAGE,
			this.GetBonusDayVisionPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])
	protected GetPreAttackBonusDamagePercentage(): [number, boolean] {
		return [this.getEffValue(this.cachedMaxDamagePct), false]
	}
	protected GetBonusDayVisionPercentage(): [number, boolean] {
		return [this.getEffValue(this.cachedMaxVisionPct), false]
	}
	protected UpdateSpecialValues(): void {
		const name = "dawnbreaker_break_of_dawn"
		this.cachedMaxVisionPct = this.GetSpecialValue("max_vision_pct", name)
		this.cachedMaxDamagePct = this.GetSpecialValue(
			"max_dmg_pct",
			name,
			Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
		)
	}
	private getEffValue(value: number): number {
		if (GameRules === undefined || GameRules.IsNight) {
			return 0
		}
		return value * (1 - GameRules.GetPhaseProgress(false))
	}
}
