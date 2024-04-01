import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("pangolier_rollup")
export class pangolier_rollup extends Ability {
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
