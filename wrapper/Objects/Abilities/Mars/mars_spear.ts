import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("mars_spear")
export class mars_spear extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("spear_range", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("spear_speed", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("spear_width", level)
	}
}
