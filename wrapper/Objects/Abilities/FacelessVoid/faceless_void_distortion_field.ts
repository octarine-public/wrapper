import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("faceless_void_distortion_field")
export class faceless_void_distortion_field extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("slow_distance_max", level)
	}
}
