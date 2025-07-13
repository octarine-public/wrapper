import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("abyssal_underlord_firestorm")
export class abyssal_underlord_firestorm extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("wave_damage", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		const wave =
			this.GetSpecialValue("wave_count", level) +
			this.GetSpecialValue("shard_wave_count_bonus", level)
		const interval = this.GetSpecialValue("wave_interval", level),
			reduction = this.GetSpecialValue("shard_wave_interval_reduction", level)
		return wave * (interval * (1 - reduction / 100))
	}
}
