import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_hurricane_pike")
export class item_hurricane_pike extends Item {
	public get Range() {
		return this.GetSpecialValue("push_length")
	}

	public GetBaseSpeedForLevel(_level: number): number {
		// https://dota2.fandom.com/ru/wiki/Hurricane_Pike
		return 1200
	}
	public GetHitTime(
		unit: Unit | Vector3,
		movement: boolean = false,
		directionalMovement: boolean = false,
		currentTurnRate: boolean = true
	) {
		return (
			this.GetCastDelay(unit, movement, directionalMovement, currentTurnRate) +
			this.ActivationDelay +
			this.Range / this.Speed
		)
	}
}
