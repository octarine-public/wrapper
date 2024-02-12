import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_glimmer_cape")
export class item_glimmer_cape extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
	/**
	 * @description Returns the cast delay of the ability. Time in seconds until the cast.
	 * @return {number}
	 */
	public GetCastDelay(
		_unit?: Unit | Vector3,
		_currentTurnRate: boolean = true,
		_rotationDiff: boolean = false
	): number {
		return this.CastDelay
	}
}
