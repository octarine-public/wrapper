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
	public get JumpRange() {
		return this.GetSpecialValue("jump_horizontal_distance")
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("impact_radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("impact_damage", level)
	}
	public GetCastDelay(
		unit?: Unit | Vector3,
		movement: boolean = false,
		directionalMovement: boolean = false,
		currentTurnRate: boolean = true
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
			turnTime = owner.TurnTimeNew(
				unit,
				movement,
				directionalMovement,
				currentTurnRate
			)
		return delay + disntance + turnTime
	}
}
