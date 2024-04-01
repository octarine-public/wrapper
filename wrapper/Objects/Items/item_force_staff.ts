import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_force_staff")
export class item_force_staff extends Item {
	public get Range() {
		return this.GetSpecialValue("push_length")
	}

	public GetBaseSpeedForLevel(_level: number): number {
		// https://dota2.fandom.com/wiki/Force_Staff
		return 1200
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
	) {
		return (
			this.ActivationDelay +
			this.GetCastDelay(unit, currentTurnRate, rotationDiff) +
			this.Range / this.Speed
		)
	}
}
