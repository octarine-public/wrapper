import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_ogre_seal_totem")
export class item_ogre_seal_totem extends Item {
	public get CastRange() {
		return super.CastRange * this.MaxBounces
	}
	public get MaxBounces() {
		return this.GetSpecialValue("max_bounces")
	}
	public get Range() {
		return this.CastRange
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("leap_speed", level)
	}

	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("leap_distance", level)
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
