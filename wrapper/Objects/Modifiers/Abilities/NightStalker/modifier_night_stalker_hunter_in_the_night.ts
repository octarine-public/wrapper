import { WrapperClassModifier } from "../../../../Decorators"
import { ModifierManager } from "../../../../Managers/ModifierManager"
import { GameRules } from "../../../Base/Entity"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_night_stalker_hunter_in_the_night extends Modifier {
	public readonly IsBuff = true
	private isEmited = false

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.BonusAttackSpeed = 0
		this.BonusMoveSpeedAmplifier = 0
		this.StatusResistanceAmplifier = 0
		this.isEmited = false
		return true
	}

	public OnIntervalThink(): void {
		this.SetBonusAttackSpeed()
		this.SetMoveSpeedAmplifier()
		this.SetStatusResistanceAmplifier()
	}

	protected SetMoveSpeedAmplifier(
		specialName = "bonus_movement_speed_pct_night",
		_subtract = false
	): void {
		const value = this.GetSpecialMoveSpeedByState(specialName)
		this.BonusMoveSpeedAmplifier = GameRules?.IsNight ? value / 100 : 0
	}

	protected SetBonusAttackSpeed(
		specialName = "bonus_attack_speed_night",
		_subtract = false
	): void {
		const value = this.GetSpecialAttackSpeedByState(specialName)
		this.BonusAttackSpeed = GameRules?.IsNight ? value : 0
	}

	protected SetStatusResistanceAmplifier(
		specialName = "bonus_status_resist_night",
		_subtract = false
	) {
		const isDisabled = this.IsPassiveDisabled()
		const value = this.GetSpecialValue(specialName)
		const state = GameRules?.IsNight && !isDisabled
		this.StatusResistanceAmplifier = state ? value / 100 : 0
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThink(this)
		}
	}
}
