import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("drow_ranger_wave_of_silence")
export class drow_ranger_wave_of_silence extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("wave_width", level)
	}

	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("wave_speed", level)
	}
}
