import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("kez_echo_slash")
export class kez_echo_slash extends Ability {
	public get TravelDistance(): number {
		return this.GetSpecialValue("travel_distance")
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("katana_radius", level)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("katana_distance", level)
	}
}
