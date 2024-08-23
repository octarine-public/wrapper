import { HealthGainPerStrength } from "../../../Data/GameData"
import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("ringmaster_strongman_tonic")
export class ringmaster_strongman_tonic extends Ability implements IHealthRestore<Unit> {
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = true
	public readonly HealthRestoreModifierName = "modifier_ringmaster_strongman_tonic_buff"

	public GetHealthRestore(_target: Unit): number {
		const level = Math.max(this.Owner?.Level ?? 0, 1)
		const baseBonus = this.GetSpecialValue("strength_bonus_base")
		const bonusPerLevel = this.GetSpecialValue("strength_bonus_per_level")
		return (baseBonus + bonusPerLevel * level) * HealthGainPerStrength
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
