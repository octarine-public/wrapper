import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("abyssal_underlord_pit_of_malice")
export class abyssal_underlord_pit_of_malice extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("pit_damage", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("pit_duration", level)
	}
}
