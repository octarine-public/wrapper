import { Vector3 } from "../../../Base/Vector3"
import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("snapfire_firesnap_cookie")
export class snapfire_firesnap_cookie extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public get CookieSpeed(): number {
		return this.GetSpecialValue("projectile_speed")
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("impact_radius", level)
	}

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
