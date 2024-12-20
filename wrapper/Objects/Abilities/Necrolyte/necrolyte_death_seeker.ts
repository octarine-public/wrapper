import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("necrolyte_death_seeker")
export class necrolyte_death_seeker extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const deathPulse = owner.GetAbilityByName("necrolyte_death_pulse")
		return deathPulse?.GetBaseDamageForLevel(level) ?? 0
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const deathPulse = owner.GetAbilityByName("necrolyte_death_pulse")
		return deathPulse?.GetBaseAOERadiusForLevel(level) ?? 0
	}
	public GetBaseSpeedForLevel(level: number): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const deathPulse = owner.GetAbilityByName("necrolyte_death_pulse")
		return deathPulse?.GetBaseSpeedForLevel(level) ?? 0
	}
}
