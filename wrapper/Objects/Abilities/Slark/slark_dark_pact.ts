import { Vector3 } from "../../../Base/Vector3"
import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Entity } from "../../Base/Entity"
import { Unit } from "../../Base/Unit"

@WrapperClass("slark_dark_pact")
export class slark_dark_pact extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("delay", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("total_damage", level)
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
		if (unit instanceof Entity && this.Owner === unit) {
			return this.CastDelay
		}
		return super.GetHitTime(unit, currentTurnRate, rotationDiff)
	}
}
