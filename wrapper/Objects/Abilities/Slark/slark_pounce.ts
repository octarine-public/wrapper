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
		return true
	}
	public get Speed() {
		return this.Owner?.HasScepter ? super.Speed * 2 : super.Speed
	}
	public get Range() {
		return this.CastRange + this.AOERadius
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("pounce_speed", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("pounce_radius", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue(
			!this.Owner?.HasScepter ? "pounce_distance" : "pounce_distance_scepter",
			level
		)
	}
	/**
	 * @description Returns the cast delay of the ability. Time in seconds until the cast.
	 * @param {Unit | Vector3} unit - The unit or position to calculate hit time for
	 * @param {boolean} currentTurnRate -  Flag to indicate if current turn rate is considered
	 * @param {boolean} rotationDiff - Flag to indicate if rotation difference is considered
	 * @return {number}
	 */
	public GetHitTime(
		unit: Unit | Vector3,
		currentTurnRate: boolean = true,
		rotationDiff: boolean = false
	): number {
		return (
			this.ActivationDelay +
			this.GetCastDelay(unit, currentTurnRate, rotationDiff) +
			this.Range / this.Speed
		)
	}
}
