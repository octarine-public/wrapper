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
	public GetHitTime(
		unit: Unit | Vector3,
		movement: boolean = false,
		directionalMovement: boolean = false,
		currentTurnRate: boolean = true
	): number {
		if (unit instanceof Entity && this.Owner === unit) {
			return this.CastDelay
		}
		return super.GetHitTime(unit, movement, directionalMovement, currentTurnRate)
	}
}
