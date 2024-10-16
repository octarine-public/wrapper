import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_dragon_knight_frost_breath_slow extends Modifier {
	public readonly IsDebuff = true

	private get amplificationBonus() {
		const owner = this.Caster
		const dragonForm = owner?.GetAbilityByName("dragon_knight_elder_dragon_form")
		const specialValue = dragonForm?.GetSpecialValue("frost_breath_effect_bonus")
		return 1 + (specialValue ?? 0) / 100
	}

	protected SetMoveSpeedAmplifier(
		specialName = "frost_bonus_movement_speed",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}

	protected SetBonusAttackSpeed(
		specialName = "frost_bonus_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	protected GetSpecialValue(
		specialName: string,
		level: number = this.AbilityLevel
	): number {
		if (!this.IsValid || this.Caster === undefined) {
			return 0
		}
		if (this.isBlackDragonForm(this.Caster)) {
			level += 1
		}
		return super.GetSpecialValue(specialName, level) * this.amplificationBonus
	}

	private isBlackDragonForm(unit: Nullable<Unit>) {
		return unit?.HasBuffByName("modifier_dragon_knight_black_dragon_tooltip") ?? false
	}
}
