import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("pangolier_gyroshell")
export class pangolier_gyroshell extends Ability {
	public get TurnRate() {
		return Math.degreesToRadian(this.GetSpecialValue("turn_rate"))
	}
	public get HitRadius() {
		return this.GetSpecialValue("hit_radius")
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("forward_move_speed", level)
	}
}
