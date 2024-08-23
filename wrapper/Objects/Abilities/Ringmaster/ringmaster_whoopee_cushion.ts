import { Vector3 } from "../../../Base/Vector3"
import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("ringmaster_whoopee_cushion")
export class ringmaster_whoopee_cushion extends Ability {
	public GetHitTime(
		unit: Unit | Vector3,
		currentTurnRate: boolean = true,
		rotationDiff: boolean = false
	): number {
		return (
			this.ActivationDelay +
			this.GetCastDelay(unit, currentTurnRate, rotationDiff) +
			this.CastRange / this.Speed
		)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("leap_distance", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("leap_speed", level)
	}
}
