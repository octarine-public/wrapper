import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_psychic_headband")
export class item_psychic_headband extends Item {
	public get Range() {
		return this.GetSpecialValue("push_length")
	}

	public GetBaseSpeedForLevel(_level: number): number {
		// https://dota2.fandom.com/wiki/Psychic_Headband
		return 1333.33
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
