import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_psychic_headband")
export class item_psychic_headband extends Item {
	public get Range() {
		return this.GetSpecialValue("push_length")
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(_level: number): number {
		// https://dota2.fandom.com/wiki/Psychic_Headband
		return 1333.33
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
