import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_glimmer_cape")
export class item_glimmer_cape extends Item {
	public get IsInvisibility() {
		return true
	}
	/**
	 * @description Returns the cast delay of the ability. Time in seconds until the cast.
	 * @return {number}
	 */
	public GetCastDelay(
		_unit?: Unit | Vector3,
		_movement: boolean = false,
		_directionalMovement: boolean = false,
		_currentTurnRate: boolean = true
	): number {
		return this.CastDelay
	}
}
