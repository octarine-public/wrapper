import { Vector3 } from "../../../Base/Vector3"
import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("primal_beast_rock_throw")
export class primal_beast_rock_throw extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("base_damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("impact_radius", level)
	}
	public GetFragmentAOERadiusForLevel(level: number = this.Level): number {
		return this.GetSpecialValue("fragment_impact_radius", level)
	}
	public GetTravelTime(
		distance: number,
		clampMinDistance: number = this.GetSpecialValue("min_range"),
		rangeMax: number = this.CastRange,
		minTravelTime: number = this.GetSpecialValue("min_travel_time"),
		maxTravelTime: number = this.GetSpecialValue("max_travel_time")
	): number {
		return Math.remapRange(
			distance,
			clampMinDistance,
			rangeMax,
			minTravelTime,
			maxTravelTime
		)
	}
	public GetEndRadius(
		startPos: Vector3,
		endPos: Vector3,
		startRadius: number,
		angleDeg: number = 15
	): number {
		const distance = startPos.Distance2D(endPos)
		return startRadius + distance * Math.tan(Math.degreesToRadian(angleDeg))
	}
}
