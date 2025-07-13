import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("void_spirit_dissimilate")
export class void_spirit_dissimilate extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("first_ring_distance_offset", level) * 1.5
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("phase_duration", level)
	}
}
