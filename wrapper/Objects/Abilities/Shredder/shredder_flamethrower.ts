import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("shredder_flamethrower")
export class shredder_flamethrower extends Ability {
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("width", level)
	}
	public GetCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("length", level)
	}
}
