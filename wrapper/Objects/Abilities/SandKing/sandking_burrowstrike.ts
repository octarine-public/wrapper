import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("sandking_burrowstrike")
export class sandking_burrowstrike extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("burrow_width", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		const specialName = `burrow_speed${this.Owner?.HasScepter ? "_scepter" : ""}`
		return this.GetSpecialValue(specialName, level)
	}
}
