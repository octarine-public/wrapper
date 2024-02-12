import { Vector3 } from "../../../Base/Vector3"
import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("snapfire_firesnap_cookie")
export class snapfire_firesnap_cookie extends Ability {
	/**
	 * @param level
	 * @return {number}
	 */
	public get CookieSpeed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("impact_radius", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
	/**
	 * @description Returns the cast delay of the ability. Time in seconds until the cast.
	 * @param {Unit | Vector3} unit - The unit or position to calculate hit time for
	 * @param {boolean} currentTurnRate -  Flag to indicate if current turn rate is considered
	 * @param {boolean} rotationDiff - Flag to indicate if rotation difference is considered
	 * @return {number}
	 */
	public GetCastDelay(
		unit?: Unit | Vector3,
		currentTurnRate: boolean = true,
		rotationDiff: boolean = false
	): number {
		const owner = this.Owner,
			delay = this.CastDelay
		if (owner === undefined || unit === undefined || this.NoTarget) {
			return delay
		}
		if (!(unit instanceof Vector3)) {
			unit = unit.Position
		}
		const disntance = owner.Distance2D(unit) / this.CookieSpeed,
			turnTime = owner.GetTurnTime(unit, currentTurnRate, rotationDiff)
		return delay + disntance + turnTime
	}
}
