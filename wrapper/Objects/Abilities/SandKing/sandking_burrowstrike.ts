import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("sandking_burrowstrike")
export class sandking_burrowstrike extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("burrow_width", level)
	}

	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		const specialName = `burrow_speed${this.Owner?.HasScepter ? "_scepter" : ""}`
		return this.GetSpecialValue(specialName, level)
	}
}
