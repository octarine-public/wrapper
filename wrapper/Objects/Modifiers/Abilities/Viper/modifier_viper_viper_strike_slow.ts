import { WrapperClassModifier } from "../../../../Decorators"
import { ModifierManager } from "../../../../Managers/ModifierManager"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_viper_viper_strike_slow extends Modifier {
	public readonly IsDebuff = true

	private isEmited = false

	public OnIntervalThink(): void {
		this.SetBonusAttackSpeed()
		this.SetMoveSpeedAmplifier()
	}

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
		return true
	}

	public SetBonusAttackSpeed(
		specialName = "bonus_attack_speed",
		subtract = false
	): void {
		const baseValue = this.GetSpecialAttackSpeedByState(specialName)
		const value = this.getSpeedByTime(baseValue)
		this.BonusAttackSpeed = subtract ? value * -1 : value
	}

	public SetMoveSpeedAmplifier(
		specialName = "bonus_movement_speed",
		subtract = false
	): void {
		const baseValue = this.GetSpecialMoveSpeedByState(specialName)
		const value = this.getSpeedByTime(baseValue)
		this.BonusMoveSpeedAmplifier = (subtract ? value * -1 : value) / 100
	}

	private getSpeedByTime(value: number): number {
		return (1 - this.ElapsedTime / this.Duration) * value
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThinkTemporary(this)
		}
	}
}
