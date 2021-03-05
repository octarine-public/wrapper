import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("earthshaker_echo_slam")
export default class earthshaker_echo_slam extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("echo_slam_damage_range", level)
	}
}
