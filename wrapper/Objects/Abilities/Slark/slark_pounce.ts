import { Vector3 } from "../../../Base/Vector3"
import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("slark_pounce")
export class slark_pounce extends Ability {
	public get MaxCharges(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("max_charges") : 0
	}
	public get MaxChargeRestoreTime(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("charge_restore_time") : 0
	}
	public get UsesRotation() {
		return this.NoTarget
	}
	public get Speed() {
		return this.Owner?.HasScepter ? super.Speed * 2 : super.Speed
	}
	public get Range() {
		return this.CastRange + this.AOERadius
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("pounce_speed", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("pounce_radius", level)
	}

	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue(
			!this.Owner?.HasScepter ? "pounce_distance" : "pounce_distance_scepter",
			level
		)
	}
	public GetHitTime(
		unit: Unit | Vector3,
		movement: boolean = false,
		directionalMovement: boolean = false,
		currentTurnRate: boolean = true
	): number {
		return (
			this.ActivationDelay +
			this.GetCastDelay(unit, movement, directionalMovement, currentTurnRate) +
			this.Range / this.Speed
		)
	}
}
