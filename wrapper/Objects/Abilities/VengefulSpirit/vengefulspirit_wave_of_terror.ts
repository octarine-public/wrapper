import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("vengefulspirit_wave_of_terror")
export class vengefulspirit_wave_of_terror extends Ability implements INuke {
	public get SkillshotRange(): number {
		return this.CastRange + this.AOERadius
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("wave_width", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("wave_speed", level)
	}
}
